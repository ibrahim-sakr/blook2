'use strict';

/**
 * Requring essentials
 */
var express                 = use('express'),
    app                     = customUse('App'),

    /**
     * Requring Middlewares
     */
    frontAuth               = useMiddle('Auth.frontAuth'),
    DB                      = useMiddle('DBConnection'),
    authObject              = useMiddle('authObject'),
    Pagination              = useMiddle('setPagination'),
    injectJWT               = useMiddle('injectJWT'),

    /**
     * Requring Controllers
     */
    RegionController        = useController('Front.RegionController'),
    ProfileController       = useController('Front.ProfileController'),
    CategoryController      = useController('Front.CategoryController'),
    TerminalController      = useController('Front.TerminalController'),
    TodolistController      = useController('Front.TodolistController'),
    InstanceController      = useController('Front.InstanceController'),
    BranchController        = useController('Front.BranchController'),
    PlaceController         = useController('Front.PlaceController'),
    MessageController       = useController('Front.MessageController'),
    VoilationController     = useController('Front.VoilationController'),
    PositionController      = useController('Front.PositionController'),
    PrivilegeController     = useController('Front.PrivilegeController'),
    SignController          = useController('Front.SignController'),
    LanguageController      = useController('Front.LanguageController'),
    GeographicalController  = useController('Front.GeographicalController'),
    DashboardController     = useController('Front.DashboardController');
    SettingsController      = useController('Front.SettingsController');

// for Frontend Only.
module.exports = function(){
    /**
     * Frontend Router for Angular JS
     */
    var fe = express.Router();

    /**
     * Signin & out Routes.
     * define SignIn/Out Route before AuthMiddleware calling to Prevent loop on signin
     */
    fe.post('/signin', DB, SignController.in);
    // fe.post('/signout', SignController.out);
    fe.get('/i18n', LanguageController.getLang);

    /**
     * start Middlewares
     */
    fe.use(frontAuth);
    fe.use(DB);
    // fe.use(authObject);
    fe.use(Pagination);
    app.use('/front', fe);

        /**
         * Language Route
         */

        /**
         * Profile routes
         */
        var profile = express.Router();
        profile.route('/')
            .get(ProfileController.index)
            .put(ProfileController.update);
        fe.use('/profile', profile);

        /**
         * Users routes
         */
        var users = express.Router();
        users.route('/')
            .get(TerminalController.index)
            .post(TerminalController.create);
        users.route('/usersformessages').get(TerminalController.usersForMessages);
        users.route('/attterminals').get(TerminalController.attTerminals);
        users.route('/withtodolist/:id').get(TerminalController.withtodolist);
        users.route('/:id/location').get(TerminalController.location);
        users.route('/:id/qr').post(TerminalController.qr);
        users.route('/:id/attendence').post(TerminalController.attendence);
        users.route('/:id/info').get(TerminalController.info);
        users.route('/:id')
            .get(TerminalController.find)
            .put(TerminalController.update)
            .delete(TerminalController.delete);
        fe.use('/users', users);

        /**
         * Positions routes
         */
        var positions = express.Router();
        positions.route('/')
            .get(PositionController.index)
            .post(PositionController.create);
        positions.route('/:id')
            .get(PositionController.find)
            .put(PositionController.update)
            .delete(PositionController.delete);
        fe.use('/positions', positions);

        /**
         * Privileges routes
         */
        var privileges = express.Router();
        privileges.route('/')
            .get(PrivilegeController.index)
        privileges.route('/:id')
            .get(PrivilegeController.find)
            .put(PrivilegeController.update)
            .delete(PrivilegeController.delete);
        fe.use('/privileges', privileges);

        /**
         * Branchs routes
         */
        var branchs = express.Router();
        branchs.route('/')
            .get(BranchController.index)
            .post(BranchController.postCreate);
        branchs.route('/:id')
            .get(BranchController.find)
            .put(BranchController.update)
            .delete(BranchController.delete);
        fe.use('/branchs', branchs);

        /**
         * Regions routes
         */
        var regions = express.Router();
        regions.route('/')
            .get(RegionController.index)
            .post(RegionController.create);  // the same modification
        regions.route('/:id')
            .get(RegionController.find)
            .put(RegionController.update)
            .delete(RegionController.delete);
        fe.use('/regions', regions);

        /**
         * Places routes
         */
        var places = express.Router();
        places.route('/')
            .get(PlaceController.index)
            .post(PlaceController.create); // the same modification
        places.route('/:id')
            .get(PlaceController.find)
            .put(PlaceController.update)
            .delete(PlaceController.delete);
        fe.use('/places', places);

        /**
         * Groups routes
         */
        var categories = express.Router();
        categories.route('/:type')
            .get(CategoryController.index)
            .post(CategoryController.create);
        categories.route('/:type/:id')
            .get(CategoryController.find)
            .put(CategoryController.update)
            .delete(CategoryController.delete);
        fe.use('/categories', categories);

        /**
         * Instances routes
         */
        var instances = express.Router();
        instances.route('/')
            .get(InstanceController.index)
            .post(InstanceController.postCreate); // the same modification
        instances.route('/:id')
            .get(InstanceController.find)
            .put(InstanceController.update)
            .delete(InstanceController.delete);
        instances.route('/add')
            .get(InstanceController.getCreate)
        fe.use('/instances', instances);

        /**
         * Messages routes
         */
        var messages = express.Router();
        messages.route('/')
            .post(MessageController.create);
        messages.route('/inbox').get(MessageController.inbox);
        messages.route('/outbox').get(MessageController.outbox);
        messages.route('/:id')
            .get(MessageController.find)
            .delete(MessageController.delete);
        fe.use('/messages', messages);

        /**
         * Todolists routes
         */
        var todolists = express.Router();
        todolists.route('/')
            .get(TodolistController.index)
            .post(TodolistController.create);
        todolists.route('/:id')
            .get(TodolistController.find)
            .put(TodolistController.update)
            .delete(TodolistController.delete);
        todolists.route('/getusertodolist/:userId/:todolistId').get(TodolistController.getUserTodolist);
        fe.use('/todolists', todolists);

        /**
         * Geographical routes
         */
        var geographical = express.Router();
        geographical.get('/vehicles',        GeographicalController.vehicles);
        geographical.get('/users',           GeographicalController.users);
        geographical.get('/regions',         GeographicalController.regions);
        geographical.get('/places',          GeographicalController.places);
        geographical.get('/incidents',       GeographicalController.incidents);
        geographical.get('/violations',      GeographicalController.violations);
        geographical.get('/deleteincident/:id',  GeographicalController.deleteincident);
        geographical.get('/deleteviolation/:id', GeographicalController.deleteviolation);
        geographical.get('/searchdb/:model', GeographicalController.searchdb);
        geographical.post('/tracking',       GeographicalController.tracking);
        fe.use('/geographical', geographical);
        
        /**
         * Dachboard routes
         */
        var dashboard = express.Router();
        dashboard.get('/vehiclescount', DashboardController.vehiclesCount);
        dashboard.get('/placescount', DashboardController.placesCount);
        dashboard.get('/violationscount', DashboardController.violationsCount);
        dashboard.get('/regionscount', DashboardController.regionsCount);
        dashboard.get('/employeescount', DashboardController.employeesCount);
        dashboard.get('/todoscount', DashboardController.todosCount);
        dashboard.get('/incidentscount', DashboardController.incidentsCount);
        fe.use('/dashboard', dashboard);
        
        /**
         * Settings routes
         */
        var settings = express.Router();
        settings.post('/checkinlocation', SettingsController.checkinLocation);
        settings.post('/margin',          SettingsController.margin);
        settings.post('/holidays',        SettingsController.holidays);
        settings.post('/app',             SettingsController.app);
        settings.post('/branch',          SettingsController.branch);
        settings.post('/samples',         SettingsController.samples);
        settings.post('/attendence',      SettingsController.attendence);
        fe.use('/settings', settings);
}
