var Message = useModel('Message');
var User    = useModel('User');
var Config  = useUtil('Config');

/*
 * Massage Controller
 */
var MessageController = function(){
    this.inbox = function(req, res){
        if( !userCan("access_messages") ) return res.status(401).end();
        
        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');

        Message.where({
            where: {
                "reciever.id": GLOBAL.getUserObject("_id")
            },
            filter: {
                _id: 1,
                title: 1,
                body: 1,
                reciever: 1
            }
        },function(msgs){
            if (msgs.length) {
                msgs.forEach(function(msg){
                    Message.update({
                        "_id" : msg._id,
                        "reciever" : {
                            $elemMatch : {
                                sent : false ,
                                id : GLOBAL.getUserObject("_id")
                            }
                        }
                    },{ "reciever.$.sent" : true });
                });
                var ret = msgs.map(function(elem, index, arr){
                    var newElem;
                    for(var i = 0; i < elem.reciever.length; i++){
                        if (elem.reciever[i].id.toString() == GLOBAL.getUserObject("_id").toString()) {
                            elem.seen = elem.reciever[i].seen;
                            newElem = elem;
                        };
                    };
                    delete newElem.reciever;
                    return newElem;
                });
                return res.json(ret);
            };
            return res.json([]).end();
        }, pagination);
    };
    
    this.outbox = function(req, res){
        if( !userCan("access_messages") ) return res.status(401).end();
        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');
        Message.where({
            where: {
                sender: GLOBAL.getUserObject("_id")
            },
            filter: {
                _id: 1,
                title: 1,
                body: 1,
            }
        }, function(msgs){
            return res.json(msgs);
        }, pagination);
    };
    
    this.find = function(req, res){
        if( !userCan("access_messages") ) return res.status(401).end();
        var type = req.query.type;
        Message.find({
            _id: GLOBAL.objectId(req.params.id),
            filter: {
                created_at: 0
            }
        }, function(doc){
            Message.update({
                "_id" : doc._id,
                "reciever" : {
                    $elemMatch : {
                        seen : false ,
                        id : GLOBAL.getUserObject("_id")
                    }
                }
            },{ "reciever.$.seen" : true });
            if (type == 'inbox') {
                User.find(doc.sender, function(user){
                    doc.sender = {
                        _id: doc.sender,
                        name: user.firstName+" "+user.lastName
                    }
                    delete doc.reciever;
                    return res.json(doc);
                });
            };
            if (type == 'outbox') {
                var ids = [];
                doc.reciever.forEach(function(rec){
                    ids.push(rec.id);
                });
                User.where({
                    where: {
                        _id: {
                            $in: ids
                        }
                    },
                    filter: {
                        firstName: 1,
                        lastName: 1
                    }
                }, function(users){
                    doc.to = [];
                    users.forEach(function(user){
                        doc.to.push({
                            _id: user._id,
                            name: user.firstName +" "+ user.lastName
                        });
                    });
                    delete doc.reciever;
                    delete doc.sender;
                    return res.json(doc);
                });
            }
        });
    };
    this.delete = function(req, res){
        if( !userCan("access_messages") ) return res.status(401).end();
        Message.delete(GLOBAL.objectId(req.params.id), function(doc){
            return res.status(200).end();
        });
    };

    this.create = function(req, res){
        if( !userCan("access_messages") ) return res.status(401).end();

        var reciever = req.body.to.map(function(elem, index){
            return {
                "id" : GLOBAL.objectId(elem),
                "seen" : false,
                "sent" : false
            };
        });

        var obj = {
            sender:     GLOBAL.getUserObject("_id"),
            title:      req.body.title,
            body:       req.body.body,
            sent_at:    new Date(),
            created_at: new Date(),
            reciever:   reciever
        };

        Message.create(obj, function(doc){
            return res.json({
                status: doc.result.ok,
                insertedCount: doc.insertedCount,
                insertedId: doc.insertedId
            });
        });
    };

}
module.exports = new MessageController;
