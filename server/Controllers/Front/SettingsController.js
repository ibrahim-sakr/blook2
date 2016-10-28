var Branch          = useModel("Branch");
var Category        = useModel("Category");
var User            = useModel("User");
var AttendenceSettings = useModel("AttendenceSettings");
var notifyUpdate    = useEvent("notifyUpdate");

/*
 * Settings Controller
 */
SettingsController = function(){
    this.margin = function(req, res){
        var timeMargin = {};
        if (req.body.delayMargin.active) {
            timeMargin.delayMargin = req.body.delayMargin.val
        }
        if (req.body.overTimeMargin.active) {
            timeMargin.overTimeMargin = req.body.overTimeMargin.val
        }
        Branch.update({
            _id: GLOBAL.objectId(GLOBAL.getUserObject("branch._id"))
        }, {
            timeMargin: timeMargin
        }, function(data){
            if (data.modifiedCount >= 1) {
                return res.json(data);
            }
            return res.status(204).end();
        });
    };
    this.checkinLocation = function(req, res){
        var obj = {};
        if (req.body.userIds) {
            var ids = req.body.userIds.map(function(id){
                return GLOBAL.objectId(id);
            });
            obj = { _id: { $in: ids } };
        };
        if (req.body.groupIds) {
            var ids = req.body.groupIds.map(function(id){
                return GLOBAL.objectId(id);
            });            
            obj = { group_id: { $in: ids } };
        };
        User.update(obj, {
            update: true,
            checkinLocation: GLOBAL.objectId(req.body.location)
        }, function(data){
            if (data.modifiedCount >= 1) {
                return res.json(data);
            }
            return res.status(204).end();
        });
    };
    this.branch = function(req, res){
        Branch.update({
            _id: GLOBAL.objectId(GLOBAL.getUserObject("branch._id"))
        }, req.body, function(data){
            if (data.modifiedCount >= 1) {
                notifyUpdate.send();
                return res.json({
                    modifiedCount: data.modifiedCount
                });
            }
            return res.status(204).end();
        });
    };
    this.app = function(req, res){
        User.update({
            _id: GLOBAL.objectId(GLOBAL.getUserObject("_id"))
        }, {webpref: req.body}, function(data){
            if (data.modifiedCount >= 1) {
                return res.json({
                    modifiedCount: data.modifiedCount
                });
            }
            return res.status(204).end();
        });
    };
    this.samples = function(req, res){
        var samples = {};
        if (req.body.perDistance.active) {
            samples.type = "distance";
            samples.value = req.body.perDistance.val
        } else if (req.body.perTime.active) {
            samples.type = "time";
            samples.value = req.body.perTime.val
        } else return res.status(400).end();
        Branch.update({
            _id: GLOBAL.objectId(GLOBAL.getUserObject("branch._id"))
        }, {
            samples: samples
        }, function(data){
            if (data.modifiedCount >= 1) {
                notifyUpdate.send();
                return res.json(data);
            }
            return res.status(204).end();
        });
    };
    this.holidays = function(req, res){
        var obj = {};       
        var ids = req.body.ids.map(function(id){
            return GLOBAL.objectId(id);
        });
        if (req.body.type == "group")    obj = { group_id: { $in: ids } };
        if (req.body.type == "terminal") obj = { _id: { $in: ids } };
        
        User.update(obj, {
            update: true,
            holidays: req.body.days
        }, function(data){
            if (data.modifiedCount >= 1) {
                return res.json(data);
            }
            return res.status(204).end();
        });
    };
    this.attendence = function(req, res){
        // check attendence type regular, shifting
        // if regular then
            // save it in attendence_settings collection
            // loop throw all terminals and save workingHour with _id
        // if shifting
            // save 3 shifts in attendence_settings collection
            // if there is any groups or terminal selected
            // then loop throw them and save foreach one the workingHour
        if (req.body.type == "regular") {
            AttendenceSettings.where({type: "regular"}, function(AttendenceSettingsTime){
                AttendenceSettings.update({_id: AttendenceSettingsTime[0]._id}, {
                    from: req.body.time.from.toString(),
                    to: req.body.time.to.toString()
                }, function(data){
                    User.update({}, {
                        update: true,
                        workingHour: AttendenceSettingsTime[0]._id
                    }, function(result){
                        if (data.modifiedCount >= 1) {
                            return res.status(200).end();
                        }
                        return res.status(204).end();
                    });
                });
            });
        }
        if (req.body.type == "shifting") {
            AttendenceSettings.where({type: { $ne: "regular" } }, function(AttendenceSettingsTime){
                AttendenceSettingsTime.forEach(function(atime){
                    var shift = req.body.time[atime.type];
                    AttendenceSettings.update({_id: atime._id}, {
                        from: shift.from.toString(),
                        to: shift.to.toString()
                    }, function(result){});
                });
                var obj = {};
                AttendenceSettingsTime.forEach(function(a){
                    obj[a.type] = a._id;
                });
                var count = 0;
                if (req.body.groups) {
                    req.body.groups.forEach(function(group){
                        User.update({ group_id: GLOBAL.objectId(group._id) }, {
                            update: true,
                            workingHour: obj[group.workHours]
                        }, function(){
                            count++;
                            if (count == req.body.groups.length) {
                                return res.status(200).end();
                            }
                        });
                    });
                }
                if (req.body.users) {
                    req.body.users.forEach(function(user){
                        User.update({_id: GLOBAL.objectId(user._id)}, {
                            update: true,
                            workingHour: obj[user.workHours]
                        }, function(){
                            count++;
                            if (count == req.body.users.length) {
                                return res.status(200).end();
                            }
                        });
                    });
                }
            });
        }
    };
}
module.exports = new SettingsController;
