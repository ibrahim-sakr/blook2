'use strict';
/**
 * Models
 */
var Attendence = useModel("Attendence");
var User       = useModel("User");
/**
 * Utilites
 */
var Validator  = useUtil("Validate");
var Moment     = use("moment");

/*
 * User Attendence Controller
 */
var UserAttendenceController = function(){
    // checkin and checkout request validation rules
    var rules = {
        time : ['required','numeric'],
        lng  : ['required','float'],
        lat  : ['required','float'],
        distance : ['required','float']
    };

    /**
     * calculate the delay amount in mins
     * @param  {Number} cit [user checkin time in Unix Millisecond Timestamp]
     * @return {Number}     [delay amount in minutes]
     */
    function calcDelay(cit){
       // user real checkin time
       var checkinTime =  Moment(cit);
       
       // preset default values from admin
       var defaultCheckinTime = getUserObject('workingHour.from');
       var delayMarginMins = getUserObject('branch.timeMargin.delayMargin');

       // if working hours settings are not set yet return 0 as delay mins
       if(!defaultCheckinTime || !delayMarginMins) return 0;
       
       // default time anlaysis 
       var time = defaultCheckinTime.split(" ")[0];
       var amORpm = defaultCheckinTime.split(" ")[1];  // checkout shift am or pm
       var Hour = (amORpm.toLowerCase() === 'am') ? time.split(":")[0] : (time.split(":")[0] + 12);  // checkout hour
       var Mins = (delayMarginMins != 0) ? (Number(time.split(":")[1]) + delayMarginMins) : Number(time.split(":")[1]);  // checkout mins + delaymarign
       
       // time expected to check in at
       var expectedCheckinTime = Moment({ y : checkinTime.year(),
                                          M : checkinTime.month(), 
                                          d : checkinTime.date(), 
                                          h : Hour, 
                                          m : Mins});
       // substract the expectedCheckintime from the real user checkintime to figure out the delay mins
       var delayMins = checkinTime.subtract(expectedCheckinTime)._d.getMinutes();
       return delayMins;
    }

    /**
     * calculate the overtime amount in mins
     * @param  {Number} cot [user checkin time in Unix Millisecond Timestamp]
     * @return {Number}     [overtime amount in minutes]
     */
    function calcOvertime(cot){
       // user real checkout time
       var checkoutTime =  Moment(cot);
       // preset default values from admin
       var defaultCheckoutTime = getUserObject('workingHour.to');
       var overtimeMarginMins = getUserObject('branch.timeMargin.overTimeMargin');
       
       // if working hours settings are not set yet return 0 as delay mins
       if(!defaultCheckoutTime || !overtimeMarginMins) return 0;

       // default time anlaysis 
       var time = defaultCheckoutTime.split(" ")[0];
       var amORpm = defaultCheckoutTime.split(" ")[1];  // checkout shift am or pm
       var Hour = (amORpm.toLowerCase() === 'am') ? Number(time.split(":")[0]) : (Number(time.split(":")[0]) + 12);  // checkout hour
       var Mins = (overtimeMarginMins != 0) ? (Number(time.split(":")[1]) + overtimeMarginMins) : Number(time.split(":")[1]);  // checkout mins + delaymarign
       // time expected to check in at
       var expectedCheckoutTime = Moment({ y : checkoutTime.year(),
                                          M : checkoutTime.month(), 
                                          d : checkoutTime.date(), 
                                          h : Hour, 
                                          m : Mins});
       // substract the expectedCheckintime from the real user checkintime to figure out the delay mins
       var overtimeMins = checkoutTime.subtract(expectedCheckoutTime)._d.getMinutes();
       return overtimeMins;

    }

    
    this.checkin = function(req, res){
        // checkin request
        var checkIn = {
            time : String(req.body.time)  || '',
            lng  : String(req.body.lng)   || '', 
            lat  : String(req.body.lat)   || '',
            distance : String(req.body.distance) || ''
        };
        // the user object
        var user = getUserObject();
        // checking if the user is already checked in or not
        if(user.attr.checked) {
            // select and send the last time this user has checked in
            Attendence.whereSortFiltred({where : {user_id : objectId(user._id)}, filter : {presence : 1}}, {date : -1}, function(result){
                  var timestamp = new Date(result[0].presence.time).getTime();
                  return res.status(400).json({msg : "user is already has checked in", lastCheckin : timestamp}).end();
            }, 1);
            return true;
        }
        // validate level
        Validator.make(checkIn, rules, function(err){
            // check errors level
            if(err) return res.status(400).json({msg : err}).end();
            else // or prepare the response
                // prepare attendence object to be inserted
                var attendence = {
                    user_id : user._id,
                    date    : new Date(),
                    presence : {
                        time : new Date(Number(checkIn.time)),
                        location : [checkIn.lat, checkIn.lng],
                        distance : checkIn.distance,
                        delayMins: calcDelay(Number(checkIn.time))
                    }
                };
                // update user status to checked true
                User.update({'_id' : objectId(user._id)},{'attr.checked' : true}, function(no){
                    
                    // create it and finally push response
                    Attendence.create(attendence, function(ats){
                        return res.status(201).json({msg : "ok"}).end();
                    });

                });
        });
        
        
    };

    this.checkout = function(req,res){

        // check out request
        var checkOut = {
            time : String(req.body.time) || '',
            lng  : String(req.body.lng)  || '', 
            lat  : String(req.body.lat)  || '',
            distance : String(req.body.distance) || ''
        };
        // the user object
        var user = getUserObject();
        // check if the user is already checked out
        if(!user.attr.checked) {
           // select and send the last time this user has checked in
            Attendence.whereSortFiltred({where : {user_id : objectId(user._id)}, filter : {departure : 1}}, {date : -1}, function(result){
              var timestamp = new Date(result[0].departure.time).getTime();
                  return res.status(400).json({msg : "user is already has checked out", lastCheckout : timestamp}).end();
            }, 1);
            return true;
        }
        // validation level
        Validator.make(checkOut, rules, function(err){
            // check errors level
            if(err) return res.status(400).json({msg : err}).end();
            else // or prepare the response
            // select the last attendence sorted dsc by date
            Attendence.where({user_id : user._id},function(ats){
                
                // prepare the depature object to be inserted
                var attendence = {
                    departure : {
                        time : new Date(Number(checkOut.time)),
                        location : [checkOut.lat, checkOut.lng],
                        distance : checkOut.distance,
                        overtimeMins :  calcOvertime(Number(checkOut.time))
                    }
                };
                
                // update the user status 
                User.update({'_id' : objectId(user._id)},{'attr.checked' : false}, function(no){
                    
                    // update the attendence object
                    Attendence.update({_id : objectId(ats[0]._id)},attendence, function(no){
                        return res.status(201).json({msg : "ok"}).end();
                    });

                });
            }, 0, {date: -1});
        })
    };

};
module.exports = new UserAttendenceController();
