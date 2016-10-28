var User           = useModel("User");
var Region         = useModel("Region");
var Place          = useModel("Place");
var Instance       = useModel("Instance");
var UserStatistics = useModel("UserStatistics");

/**
 *  Geographical Controller
 *  display data for geographical
 */
var GeographicalController = function(){

    this.deleteincident = function(req, res){
        if( !userCan("delete_incidents") ) return res.status(401).end();

        Instance.deleteWhere({
            _id: GLOBAL.objectId(req.params.id),
            type: "incident"
        }, function(data){
            if (data.modifiedCount >= 1) {
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        });
    };

    this.deleteviolation = function(req, res){
        if( !userCan("delete_violations") ) return res.status(401).end();

        Instance.deleteWhere({
            _id: GLOBAL.objectId(req.params.id),
            type: "violation"
        }, function(data){
            if (data.modifiedCount >= 1) {
                res.status(200).end();
            } else {
                res.status(400).end();
            }
        });

    };

    this.vehicles = function(req, res){
        User.where({ where: { type: "vehicle" }, filter: {} }, function(vehicles){
            return res.json(vehicles);
        });
    };

    this.users = function(req, res){
        User.where({ where: { type: "user" }, filter: {} }, function(users){
            return res.json(users);
        });
    };

    this.regions = function(req, res){
        Region.all('', function(regions){
            return res.json(regions);
        });
    };

    this.places = function(req, res){
        Place.with([
            {
                model: "Category",
                key: "category"
            },
            {
                model: "User",
                key: "uploader"
            }
        ], function(places){
            return res.json(places);
        }, 0);
    };

    this.incidents = function(req, res){
        Instance.whereWith({ type: "incident" }, [
            {
                model: "Category",
                key: "category"
            },
            {
                model: "User",
                key: "uploader"
            }
        ], function(incidents){
            return res.json(incidents);
        }, 0);
    };

    this.violations = function(req, res){
        Instance.whereWith({ type: "violation" }, [
            {
                model: "Category",
                key: "category"
            },
            {
                model: "User",
                key: "uploader"
            }
        ], function(incidents){
            return res.json(incidents);
        }, 0);
    };

    this.tracking = function(req, res){
        var from = new Date(req.body.from.replace("22:00:00", "00:00:00")),
            to   = new Date(req.body.to.replace("22:00:00", "23:59:59"));

        UserStatistics.where({
            user: GLOBAL.objectId(req.body.id),
            time: {
                $gte: from,
                $lte: to
            }
        }, function(data){
            return res.json(data);
        }, null, {'time': 1});
    };

    this.searchdb = function(req, res){
        var obj = {};
        if (req.params.model == "violation") {
            obj.type  = req.params.model;
            req.params.model = "instance";
        };
        if (req.params.model == "incident") {
            obj.type  = req.params.model;
            req.params.model = "instance";
        };

        // insure that Model typed correct
        req.params.model = req.params.model.charAt(0).toUpperCase() + req.params.model.slice(1);
        
        // start searching
        GLOBAL.useModel(req.params.model).where(obj, function(data){
            return res.json(data);
        });
    };

    // this.incidentsInRegion = function(req, res){
    //     var region_id = req.body.region;
    //     Instance.where({ where: { type: "incident", region_id: GLOBAL.objectId(region_id) }, filter: {} }, function(incidents){
    //         return res.json(incidents);
    //     });
    // };

};
module.exports = new GeographicalController();
