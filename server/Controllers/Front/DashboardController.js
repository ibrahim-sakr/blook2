var User     = useModel('User');
var Place    = useModel('Place');
var Instance = useModel('Instance');
var Todolist = useModel('Todolist');
var Region   = useModel('Region');


/*
 * Dashboard Controller
 */
var DashboardController = function() {
    function authorization(res){
        return true;
        // if ( !userCan( "view_dashboard" ) ) return res.status(401).end();
    };
    this.vehiclesCount = function(req, res){
        authorization(res);
        User.count({type: "vehicle", deleted_at: { $exists: false }}, function(count){
            return res.json({type: "vehicles", count: count});
        });
    };
    
    this.placesCount = function(req, res){
        authorization(res);
        Place.count({deleted_at: { $exists: false }}, function(count){
            return res.json({type: "places", count: count});
        });
    };
    
    this.violationsCount = function(req, res){
        authorization(res);
        Instance.count({type: "violation", deleted_at: { $exists: false }}, function(count){
            return res.json({type: "violations", count: count});
        });
    };
    
    this.regionsCount = function(req, res){
        authorization(res);
        Region.count({deleted_at: { $exists: false }}, function(count){
            return res.json({type: "regions", count: count});
        });
    };
    
    this.employeesCount = function(req, res){
        authorization(res);
        User.count({
            type: "user",
            deleted_at: { $exists: false }
        }, function(count){
            return res.json({type: "employees", count: count});
        });
    };
    this.todosCount = function(req, res){
        authorization(res);
        Todolist.count({deleted_at: { $exists: false }}, function(count){
            return res.json({type: "todos", count: count});
        });
    };
    
    this.incidentsCount = function(req, res){
        authorization(res);
        Instance.count({type: "incident", deleted_at: { $exists: false }}, function(count){
            return res.json({type: "incidents", count: count});
        });
    };
};
module.exports = new DashboardController;
