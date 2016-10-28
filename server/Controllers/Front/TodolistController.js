var Category     = useModel('Category');
var Todolist     = useModel('Todolist');
var User         = useModel('User');
var UserTodolist = useModel('UserTodolist');
var Config       = useUtil('Config');

/*
 * Todolist Controller
 */
TodolistController = function(){
    this.getUserTodolist = function(req, res){
        UserTodolist.where({
            where: {
                todolist_id: GLOBAL.objectId(req.params.todolistId),
                user:        GLOBAL.objectId(req.params.userId)
            },
        }, function(data){
            return res.json(data[0]);
        });
    };

    this.index = function(req, res){
        if( !userCan("view_todolists") ) return res.status(401).end();
        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');
        Todolist.all({}, function(lists){
            return res.json(lists);
        }, pagination);
    };
    this.find = function(req, res){
        if( !userCan("view_profile_todolists") ) return res.status(401).end();

        Todolist.find(GLOBAL.objectId(req.params.id), function(doc){
            res.json(doc);
        });
    };
    this.update = function(req, res){
        if( !userCan("edit_todolists") ) return res.status(401).end();

        var groups    = req.body.groups || false,
            terminals = req.body.terminals || false;

        Todolist.find(GLOBAL.objectId(req.params.id), function(doc){
            if (terminals) {
                var newTerminals = terminals.map(function(terminal){ 
                    return { _id: terminal };
                });
                var userTodolistObjs = createUserTodolistObjs(newTerminals, GLOBAL.objectId(req.params.id), doc);
                createUserTodolist(userTodolistObjs, GLOBAL.objectId(req.params.id), res);
            } else if (groups) {
                var newGroups = groups.map(function(group){ 
                    return GLOBAL.objectId(group);
                });
                User.where({
                    where: {
                        group_id: {
                            $in: newGroups
                        }
                    },
                    filter:{ _id: 1 }
                }, function(docs){
                    var userTodolistObjs = createUserTodolistObjs(docs, GLOBAL.objectId(req.params.id), doc);
                    createUserTodolist(userTodolistObjs, GLOBAL.objectId(req.params.id), res);
                });
            } else {
                return res.status(400).end();
            };
        });
    };
    this.delete = function(req, res){
        if( !userCan("delete_todolists") ) return res.status(401).end();

        Todolist.delete(GLOBAL.objectId(req.params.id), function(data){
            if (data.modifiedCount >= 1) {
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        });
    };
    this.create = function(req, res){
        if( !userCan("add_todolists") ) return res.status(401).end();
        var todolist = req.body.todolist,
            groups = req.body.groups || false,
            terminals = req.body.terminals || false;

        Todolist.create(todolist, function(doc){
            if (terminals) {
                var newTerminals = terminals.map(function(terminal){ 
                    return { _id: terminal };
                });
                var userTodolistObjs = createUserTodolistObjs(newTerminals, doc.insertedId, todolist);
                createUserTodolist(userTodolistObjs, doc.insertedId, res);
            } else if (groups) {
                var newGroups = groups.map(function(group){ 
                    return GLOBAL.objectId(group);
                });
                User.where({
                    where: {
                        group_id: {
                            $in: newGroups
                        }
                    },
                    filter:{ _id: 1 }
                }, function(docs){
                    var userTodolistObjs = createUserTodolistObjs(docs, doc.insertedId, todolist);
                    createUserTodolist(userTodolistObjs, doc.insertedId, res);
                });
            } else {
                return res.status(200).end();
            };
        });
    };

    function createUserTodolist(userTodolistObjs, todolist_id, res){
        UserTodolist.create(userTodolistObjs, function(doc){
            return res.json({
                status: doc.result.ok,
                todolist_id: todolist_id,
                usertodolist_count: doc.insertedCount,
                usertodolist_ids: doc.insertedIds
            });
        });
    };

    function createUserTodolistObjs(loop, id, todolist){
        var userTodolistObjs = [];
        loop.forEach(function(element, index){
            var userTodolistObj = {
                "todolist_id": id,
                "user": objectId(element._id),
                "title" : todolist.title,
                "components": [],
                "sent" : false,
                "seen" : false,
                "done" : false
            }
            todolist.components.forEach(function(e, index){
                var obj = {
                    "index": index,
                    "type" : e.type,
                    "label": e.label,
                    "default": e.default
                };
                if (e.type == "menu") {
                    obj.options = e.options;
                };
                userTodolistObj.components.push(obj);
            });
            userTodolistObjs.push(userTodolistObj);
        });
        return userTodolistObjs;
    };
}
module.exports = new TodolistController;
