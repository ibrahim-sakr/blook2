'use strict';
var Model                 = useModel('Model'),    
    Position              = useModel('Position'),
    Branch                = useModel('Branch'),
    Message               = useModel('Message'),
    UserObjectTransformer = useTransformer("UserObjectTransformer"),
    AttendenceSettings    = useModel("AttendenceSettings");

/**
 * User Model
 */
function User(){
    this.collection = 'users';
    this.messages = function(id, callback){
        Message.where({user_id: id}, function(docs){
            return callback(docs);
        });
    };

    this.object = function(id, callback){
        // load user object from DB to be available for all routes.
        this.find({_id: GLOBAL.objectId(id), filter: { password: 0 }}, function(user){
            // if user does not exist throw error
            if(!user || !Object.keys(user).length) throw "User with ID => " + id + " <= does not exist";  
            // get specific user with his privileges
            Position.findWith(GLOBAL.objectId(user.position_id), {
                model: "Privilege",
                key: "privileges_id"
            }, function(data){
                Branch.find(GLOBAL.objectId(user.branch_id), function(branch){
                    user.privliges = UserObjectTransformer.transformPrivilegesToArray(data[0].privileges);
                    user.branch    = branch;
                    // select user working hours there is any
                    if(user.workingHour)
                    {
                        AttendenceSettings.find(GLOBAL.objectId(user.workingHour), function(wh){
                            user.workingHour = wh;
                            // GLOBAL.UserObject = user;
                            return callback(user);
                        });
                    }
                    else {
                        // GLOBAL.UserObject = user;
                        return callback(user);
                    }
                });
            });
        });
    };
}
User.prototype = new Model();
module.exports = new User;
/*
{
    "_id": "564b2300af52f709b37830fa",
    "name": {
        "first": "Admin",
        "last": "User"
    },
    "mobile": "123",
    "email": "default@email.com",
    "avatar": "http://organizationtwo.blook.app:1234/uploads/photos/default-avatar.jpg",
    "branch": { "name": "Branch One" },
    "privliges": ["view_geoout", "restore_from_trash", "remove_from_trash"]
}
*/
