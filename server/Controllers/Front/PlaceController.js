var Config = useUtil('Config');
var Place = useModel('Place');
var Validate = useUtil("Validate");

/*
 * Place Controller
 */
var PlaceController = function(){
    this.index = function(req, res){
        if (!userCan('view_places')) return res.status(401).end();

        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');
        Place.all({}, function(places){
            return res.json(places);
        }, pagination);
    },
    this.find = function(req, res){
        if (!userCan('view_profile_places')) return res.status(401).end();
        
        Place.find({_id: GLOBAL.objectId(req.params.id), filter: { _id: 0 }}, function(place){
            return res.json(place);
        });
    },
    this.update = function(req, res){
        if (!userCan('edit_places')) return res.status(401).end();
        
        // validation
        var validateObject = {
            title: ['required'],
            location: ['required', 'array'],
            category: ['required']
        };
        Validate.make(req.body, validateObject, function(errs){
            if (errs) return res.status(400).json(errs);

            // make category field MongoDB ObjectID
            req.body.category = GLOBAL.objectId(req.body.category);

            // add additional data
            req.body.updated_by = GLOBAL.UserObject._id

            // save new data
            Place.updateOneByReplace(GLOBAL.objectId(req.params.id), req.body, function(doc){
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
    },
    this.delete = function(req, res){
        if (!userCan('delete_places')) return res.status(401).end();
        
        Place.delete(GLOBAL.objectId(req.params.id), function(data){
            if (data.modifiedCount >= 1) {
                return res.status(200).end();
            } else {
                return res.status(400).end();
            }
        });
    },

    this.create = function(req, res){
        if (!userCan('add_places')) return res.status(401).end();

        // validation
        var validateObject = {
            title: ['required'],
            location: ['required', 'array', 'length:2'],
            category: ['required']
        };
        Validate.make(req.body, validateObject, function(errs){
            if (errs) return res.status(400).json(errs);

            // make category field MongoDB ObjectID
            req.body.category = GLOBAL.objectId(req.body.category);
            
            // add some additional fields to track the new Place
            req.body.branch_id = GLOBAL.UserObject.branch._id
            req.body.uploader = GLOBAL.UserObject._id

            // if place does n't have any custom fields remove this property from object
            if (!req.body.customfields.length) delete req.body.customfields;

            Place.create(req.body, function(data){
                if (data.insertedCount >= 1) {
                    return res.json({
                        status: data.result.ok,
                        insertedCount: data.insertedCount,
                        insertedId: data.insertedId
                    });
                } else {
                    return res.status(400).end();
                }
            });
        });
    }

}
module.exports = new PlaceController;
