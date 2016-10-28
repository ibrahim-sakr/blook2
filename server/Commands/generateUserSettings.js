var Position   = useModel('Position');
var Branch     = useModel('Branch');
var Company    = useModel('Company');
var Privilege  = useModel('Privilege');
var User       = useModel('User');
var AttendenceSettings = useModel('AttendenceSettings');
var Place      = useModel('Place');

var generateUserSettings = function() {
	this.get = function(id, callback){
		User.find(id, function(user){
			if(!user) throw "user not found";
			// generate new data
			var count = 0;
			var end = 4;
			var userData = {
			    code: GLOBAL.objectId(id),
			    active: true,
			    data: {
			        name: user.firstName +" "+ user.lastName,
			        mobile: user.mobile,
			        imgUrl: '',
			        serverTimer: new Date().getTime(),
			        supervisors: [],
			        checkinLocation: {},
			        samples : {}
			    }
			};
			if (user.checkinLocation) {
				end++;
				Place.find(user.checkinLocation, function(place){
					if (place) {
					    userData.data.checkinLocation = {
					    	lat: place.location[0],
					    	lng: place.location[1],
					    	address: place.address
					    };
					}
				    count++;
				    if (count == end) return callback(userData);
				});
			}
			if (user.workingHour) {
				end++;
				AttendenceSettings.find(user.workingHour, function(time){
					if (time) {
					    userData.data.workHours = [time.from, time.to];
					}
				    count++;
				    if (count == end) return callback(userData);
				});
			}
			Position.find(user.position_id, function(position){
			    userData.data.job = position.name;
			    count++;
			    if (count == end) return callback(userData);
			});
			Branch.find(user.branch_id, function(branch){
			    userData.data.branch = branch.name;
			    userData.data.samples = branch.samples;
			    userData.data.timezone = branch.settings.timezone || null;
			    count++;
			    if (count == end) return callback(userData);
			});
			Company.all({}, function(company){
			    userData.data.company = company[0].name;
			    count++;
			    if (count == end) {
			        if (count == end) return callback(userData);
			    }
			});
			Privilege.where({name: "access_messages"}, function(priv){
			    var priv = priv[0]._id;
			    Position.where({privileges_id: priv}, function(pos){
			        var ids = pos.map(function(po){
			            return po._id;
			        });
			        User.where({ position_id: { $in: ids } }, function(users){
			            users.forEach(function(user){
			                userData.data.supervisors.push({
			                    id: user._id.toString(),
			                    name: user.firstName+" "+user.lastName
			                });
			            });
			            count++;
			            if (count == end) {
			                if (count == end) return callback(userData);
			            }
			        });
			    });
			})

		});
	};
}
module.exports = new generateUserSettings;
