var Config   = useUtil('Config');
var Region   = useModel('Region');
var Validate = useUtil('Validate');

/*
 * Region Controller
 */
RegionController = function(){
    this.index = function(req, res){
        if( !userCan("view_regions") ) return res.status(401).end();

        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');
        Region.all({}, function(regions){
            return res.json(regions);
        }, pagination);
    };
    this.find = function(req, res){
        if( !userCan("view_profile_regions") ) return res.status(401).end();

        Region.find({_id: GLOBAL.objectId(req.params.id), filter: { _id: 0 }}, function(doc){
            res.json(doc);
        });
    };
    this.update = function(req, res){
        if( !userCan("edit_regions") ) return res.status(401).end();
        
        // some validation
        var validateObj = {
            name: ["required"],
            location: ["required", "array"],
            region_id: ["required"]
        };
        Validate.make(req.body, validateObj, function(errs){
            if (errs) return res.status(400).json(errs);
            
            // if region is parent then delete region_id field
            if (req.body.region_id == 1) {
                delete req.body.region_id;
            };
            Region.updateOneByReplace(GLOBAL.objectId(req.params.id), req.body, function(doc){
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
    this.delete = function(req, res){
        if( !userCan("delete_regions") ) return res.status(401).end();

        Region.delete(GLOBAL.objectId(req.params.id), function(data){
            if (data.modifiedCount >= 1) {
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        });
    };
    this.create = function(req, res){
        if( !userCan("add_regions") ) return res.status(401).end();

        // some validation
        var validateObj = {
            name: ["required"],
            region_id: ["required"],
            location: ["required", "array"]
        };
        Validate.make(req.body, validateObj, function(errs){
            if (errs) return res.status(400).json(errs);

            // add additional data
            req.body.branch_id = GLOBAL.UserObject.branch._id;
            req.body.created_by = GLOBAL.UserObject._id;

            // if region is parent then delete region_id field
            if (req.body.region_id == 1) delete req.body.region_id;

            // if region does n't have any custom fields remove this property from object
            if (!req.body.customfields.length) delete req.body.customfields;

            // save new Region
            Region.create(req.body, function(data){
                return res.json({
                    status: data.result.ok,
                    insertedCount: data.insertedCount,
                    insertedId: data.insertedId
                });
            });
        });
    }
}
module.exports = new RegionController;
