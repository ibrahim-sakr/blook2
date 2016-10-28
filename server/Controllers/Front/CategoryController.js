var Config = useUtil('Config');
var Validate = useUtil('Validate');
var Category = useModel('Category');
/*
 * Category Controller
 */
CategoryController = function(){
    this.index = function(req, res){
        var type = req.params.type;
        
        if ( !userCan( "view_cats_"+ type.toLowerCase() ) && !userCan("view_settings") ) return res.status(401).end();
        
        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');
        Category.where({where: {type: type, branch_id: GLOBAL.objectId(GLOBAL.UserObject.branch._id)}, filter: { branch_id: 0, type: 0, attr: 0 }}, function(docs){
            return res.json(docs);
        }, pagination);
    };
    this.find = function(req, res){
        var type = req.params.type;
        if ( !userCan( "view_cats_"+ type.toLowerCase() + "_profile" ) ) return res.status(401).end();
        Category.where({
            _id: GLOBAL.objectId(req.params.id),
            type:type,
            branch_id: GLOBAL.objectId(GLOBAL.UserObject.branch._id)
        }, function(doc){
            return res.json(doc[0]);
        });
    };
    this.update = function(req, res){
        var type = req.params.type;
        
        if ( !userCan( "edit_cats_"+ type.toLowerCase() ) ) return res.status(401).end();
        
        var validateObj = {
            name: ["required"]
        };
        Validate.make(req.body, validateObj, function(errs){
            if (errs) return res.status(400).json(errs);

            // add additional data
            req.body.type = type;
            req.body.branch_id = GLOBAL.UserObject.branch._id;

            Category.updateOneByReplace(GLOBAL.objectId(req.params.id), req.body, function(data){
                if (data.modifiedCount >= 1) {
                    res.status(200).end();
                } else {
                    res.status(400).end();
                }
            });
        });
    };
    
    this.delete = function(req, res){
        var type = req.params.type;
        
        if ( !userCan( "delete_cats_"+ type.toLowerCase() ) ) return res.status(401).end();
        
        Category.delete(GLOBAL.objectId(req.params.id), function(data){
            if (data.modifiedCount >= 1) {
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        });
    };
    this.create = function(req, res){
        var type = req.params.type;
        
        if ( !userCan( "add_cats_"+ type.toLowerCase() ) ) return res.status(401).end();
        
        var validateObj = {
            name: ["required"]
        };
        Validate.make(req.body, validateObj, function(errs){
            if (errs) return res.status(400).json(errs);

            // add additional data
            req.body.branch_id = GLOBAL.UserObject.branch._id;
            req.body.type = type;

            // this is valid if Type === "terminal"
            if (type == "terminal") {
                req.body.attr = {
                    "startTime":"",
                    "endTime": "",
                    "shift": ["from", "to"],
                    "holidays": ["fri", "sat", ""],
                    "autoTermination": true,
                    "autoTerminationTime": "3",
                    "attendenceLocation": "",
                    "accuracyPerDistance": "50",
                }
            };
            // save Data
            Category.create(req.body, function(newCat){
                return res.json({
                    status: newCat.result.ok,
                    insertedCount: newCat.insertedCount,
                    insertedId: newCat.insertedId
                });
            });
        });
    };
}
module.exports = new CategoryController;
