var Bcrypt         = use('bcryptjs');
var User           = useModel('User');
var Attendence     = useModel('Attendence');
var Place          = useModel('Place');
var UserStatistics = useModel('UserStatistics');
var Position       = useModel('Position');
var Privilege      = useModel('Privilege');
var UserTodolist   = useModel('UserTodolist');
var Config         = useUtil('Config');
var Validate       = useUtil('Validate');
var QRCom          = useCommand('generateQR');
var notifyUpdate   = useEvent('notifyUpdate');

/*
 * Terminal Controller
 */
var TerminalController = function() {

    this.withtodolist = function(req, res){
        // from UserTodolist get all todos that have todolist_id
        // collect all users from last step
        // from User model get all users where _id in the result of last step
        UserTodolist.where({
            where: {
                todolist_id: GLOBAL.objectId(req.params.id)
            },
            filter: {
                user: 1
            }
        }, function(todos){
            var users = todos.map(function(todo){
                return todo.user;
            });
            User.where({
                where: {
                    _id: {
                        $in: users
                    }
                },
                filter: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1
                }
            }, function(users){
                return res.json(users);
            });
        });
    };

    this.location = function(req, res){
        UserStatistics.where({
            where: {
                user: GLOBAL.objectId(req.params.id)
            },
            filter: {}
        }, function(data){
            return res.json(data);
        }, 1, -1);
    };

    this.index = function(req, res){
        if( !userCan("view_terminal") && !userCan("view_settings") ) return res.status(401).end();

        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');
        User.all({
            _id: 1,
            firstName: 1,
            lastName: 1,
        }, function(users){
            return res.json(users);
        }, pagination);
    };
    
    this.attTerminals = function(req, res){
        if( !GLOBAL.userCan("view_attendence") ) return res.status(401).end();

        User.all({
            _id: 1,
            firstName:  1,
            lastName:   1,
            employeeId: 1,
            plate_no:   1,
            checkinLocation: 1
        }, function(users){
            var ids = users.map(function(user){
                return user.checkinLocation;
            });
            Place.where({
                where: { _id: { $in: ids } },
                filter: {
                    title: 1
                }
            }, function(places){
                for (var u = 0; u < users.length; u++) {
                    for (var p = 0; p < places.length; p++) {
                        if (users[u].checkinLocation && users[u].checkinLocation.toString() == places[p]._id.toString()) {
                            users[u].place = places[p];
                        }
                    }
                }
                return res.json(users);
            });
        }, 'all');
    };
    this.find = function(req, res){
        if( !userCan("view_profile_terminal") ) return res.status(401).end();

        User.find({ _id: GLOBAL.objectId(req.params.id), filter: {
            _id: 0,
            password: 0,
            branch_id: 0
        }}, function(doc){
            res.json(doc);
        });
    };
    this.update = function(req, res){
        if( !userCan("edit_terminal") ) return res.status(401).end();        
        var validateObj = {
            firstName: ['required'],
            lastName: ['required'],
            mobile: ['required', 'numeric', 'min:9'],
            position_id: ['required', 'min:24', 'max:24'],
            group_id: ['required', 'min:24', 'max:24']
        };
        if ( req.body.type == "employee" ) {
            validateObj.employeeId = ['required'];
        };
        if ( req.body.type == "vehicle" ) {
            validateObj.plate_no = ['required'];
        };

        Validate.make(req.body, validateObj, function(errs){
            if (errs) return res.status(400).json(errs);

            // add branch_id to req.body (get it from authObject)
            req.body.branch_id   = GLOBAL.UserObject.branch._id;

            // update ids to be object ids
            req.body.group_id    = GLOBAL.objectId(req.body.group_id);
            req.body.position_id = GLOBAL.objectId(req.body.position_id);
            req.body.webpref     = { lang: "en-US" };
            req.body.update      = true;

            // if place does n't have any custom fields remove this property from object
            if (!req.body.customfields.length) delete req.body.customfields;

            // check if user has messages_send priv then notify all other terminals
            Privilege.where({name: "access_messages"}, function(priv){
                Position.find(GLOBAL.objectId(req.body.position_id), function(pos){
                    if (typeof pos.privileges_id != "undefined" && pos.privileges_id.length) {
                        pos.privileges_id.forEach(function(id){
                            if (priv[0]._id.toString() == id.toString()) {
                                notifyUpdate.send();
                            }
                        });
                    }
                });
            });

            // get old password and put it with new user
            if (req.body.password) {
                Bcrypt.hash(req.body.password, 8, function(err, hash) {
                    req.body.password = hash;
                    User.updateOneByReplace(GLOBAL.objectId(req.params.id), req.body, function(doc){
                        if (doc.modifiedCount >= 1) {
                            return res.json({
                                status: doc.result.ok,
                                modifiedCount: doc.modifiedCount
                            });
                        } else {
                            return res.status(400).end();
                        }
                    });
                });
            } else {
                User.find(GLOBAL.objectId(req.params.id), function(user){
                    req.body.password = user.password;
                    User.updateOneByReplace(GLOBAL.objectId(req.params.id), req.body, function(doc){
                        if (doc.modifiedCount >= 1) {
                            return res.json({
                                status: doc.result.ok,
                                modifiedCount: doc.modifiedCount
                            });
                        } else {
                            return res.status(400).end();
                        }
                    });
                });
            };
        });

    };
    this.delete = function(req, res){
        if( !userCan("delete_terminal") ) return res.status(401).end();

        User.delete(GLOBAL.objectId(req.params.id), function(data){
            if (data.modifiedCount >= 1) {
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        });
    };
    
    this.create = function(req, res){
        if( !GLOBAL.userCan("add_terminal") ) return res.status(401).end();
        var validateObj = {
            firstName:   ['required'],
            lastName:    ['required'],
            mobile:      ['required', 'numeric', 'min:9'],
            position_id: ['required', 'min:24', 'max:24'],
            group_id:    ['required', 'min:24', 'max:24']
        };
        if ( req.body.type == "employee" ) {
            validateObj.employeeId = ['required'];
        };
        if ( req.body.type == "vehicle" ) {
            validateObj.plate_no = ['required'];
        };
        // do some validation
        Validate.make(req.body, validateObj, function(errs){
            if (errs) return res.status(400).json(errs);

            // add branch_id to req.body (get it from authObject)
            req.body.branch_id   = GLOBAL.UserObject.branch._id;

            // update ids to be object ids
            req.body.group_id    = GLOBAL.objectId(req.body.group_id);
            req.body.position_id = GLOBAL.objectId(req.body.position_id);
            req.body.webpref     = { lang: "en-US" };

            // if place does n't have any custom fields remove this property from object
            if (!req.body.customfields.length) delete req.body.customfields;

            // encrypt Password before procced
            Bcrypt.hash(req.body.password, 8, function(err, hash) {

                // insert hash key instead of old password
                req.body.password = hash;
                req.body.update = false;

                // check if user has messages_send priv then notify all other terminals
                Privilege.where({name: "access_messages"}, function(priv){
                    Position.find(GLOBAL.objectId(req.body.position_id), function(pos){
                        if (pos.privileges_id.length) {
                            pos.privileges_id.forEach(function(id){
                                if (priv[0]._id.toString() == id.toString()) {
                                    notifyUpdate.send();
                                }
                            });
                        }
                    });
                });

                // if all done then create a user
                User.create(req.body, function(user){
                    var data = {
                        protocol: req.protocol,
                        hostname: req.hostname,
                        user_id: GLOBAL.objectId(user.insertedId),
                    };
                    QRCom.generate(data, function(qr){
                        return res.json({
                            url: qr.url,
                            status: qr.result.ok,
                            insertedCount: qr.insertedCount,
                            user_id: user.insertedId
                        });
                    });
                });
            });
        });
    };

    this.qr = function(req, res){
        if( !GLOBAL.userCan("edit_terminal") ) return res.status(401).end();
        var data = {
            protocol: req.protocol,
            hostname: req.hostname,
            user_id: GLOBAL.objectId(req.params.id),
        };
        QRCom.generate(data, function(qr){
            return res.json({
                url: qr.url,
                status: qr.result.ok,
                insertedCount: qr.insertedCount,
                user_id: req.params.id.insertedId
            });
        });
    };

    this.attendence = function(req, res){
        if( !GLOBAL.userCan("view_attendence") ) return res.status(401).end();

        var id   = GLOBAL.objectId(req.params.id),
            from = new Date(req.body.from.replace("22:00:00", "00:00:00")),
            to   = new Date(req.body.to.replace("22:00:00", "23:59:59"));

        Attendence.where({
            "user_id": id,
            "presence.time": {
                $gte: from,
                $lte: to
            }
        }, function(data){
            return res.json(data);
        });
    };

    this.usersForMessages = function(req, res){
        User.where({
            where: {},
            filter: {
                _id: 1,
                firstName: 1,
                lastName: 1
            }
        }, function(users){
            if (users.length) {
                var newUsers = users.map(function(user, index, arr){
                    user.name = user.firstName +" "+ user.lastName;
                    delete user.firstName;
                    delete user.lastName;

                    return user;
                });
                return res.json(newUsers);
            }
            return res.json([]);
        });
    };

    this.info = function(req, res){
        // -- checkinLocation Object
        // -- Last Sample
        // -- Last Location
        // Sample Setting (Per Distance, Per Time)
        // -- Working Type
        // -- Start Time
        // -- End Time


        // if( !userCan("view_profile_terminal") ) return res.status(401).end();
        User.findWith(GLOBAL.objectId(req.params.id), [
            { model: 'Position',           key : 'position_id' },
            { model: 'Branch',             key : 'branch_id' },
            { model: 'Category',           key : 'group_id' },
            { model: 'Place',              key : 'checkinLocation' },
            { model: 'AttendenceSettings', key : 'workingHour' },
        ], function(user){
            UserStatistics.where({
                where: {
                    user: GLOBAL.objectId(req.params.id)
                },
                filter: {}
            }, function(data){
                delete user[0].password;
                user[0].sample = data[0];
                return res.json(user);
            }, 1, -1);
        });
    };
}
module.exports = new TerminalController;

