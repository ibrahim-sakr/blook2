'use strict';
/**
 * Requring essentials
 */
var express                  = require('express'),
    app                      = require('../App'),
/**
 * Requring Middlewares
 */
    apiAuth             = useMiddle('Auth.apiAuth'),
    DB                  = useMiddle('DBConnection'),
    authObject          = useMiddle('authObject'),
    setClientName       = useMiddle('setClientName'),
/**
 * Requiring Controllers
 */
    UserAttendenceController = useController("Api.UserAttendenceController"),
    QRCheckerController      = useController("Api.QRCheckerController"),
    UserMessagesController   = useController("Api.UserMessagesController"),
    UserPlacesController     = useController("Api.UserPlacesController"),
    UserViolationsController = useController("Api.UserViolationsController"),
    UserIncidentController   = useController("Api.UserIncidentController"),
    UserTodolistController   = useController("Api.UserTodolistController"),
    CategoriesController     = useController("Api.CategoriesController"),
    MobileSearchController   = useController("Api.MobileSearchController"),
    ImageManagerController   = useController("Api.ImageManagerController"),
    UserStatisticsController = useController("Api.UserStatisticsController"),
    UserSettingsController   = useController("Api.UserSettingsController");   
    /**
     * For testing purposes only
     */
    var ReactiveQrCodeController = useController("Api.ReactiveQrCodeController");

/**
 * Mobile Api endpoints
 */
module.exports = function(){

    /**
     * for test purposes only
     * to reactive deactivated qr code
     */
    var qrActive = express.Router();
    qrActive.use(DB);
    qrActive.route('/:code').post(ReactiveQrCodeController.active);
    app.use('/active',qrActive);

    /**
     * QR verification Route
     */
    
    var qrChecker = express.Router();
    qrChecker.use(DB);
    qrChecker.route('/:code').post(QRCheckerController.check);
    app.use('/check',qrChecker);
    
    /**
     * Authenticated Api Router for Mobile App
     */
    var api = express.Router();
    api.use(apiAuth);
    api.use(DB);
    api.use(authObject);
    api.use(setClientName);
    app.use('/api/v1',api);

    /**
     * Attendence Routes
     */
    var ats = express.Router();
    ats.route("/in").post(UserAttendenceController.checkin);
    ats.route("/out").post(UserAttendenceController.checkout);
    api.use('/check',ats);

     /**
     * Messages Routes
     */
    var msg = express.Router();
    msg.route('/send').post(UserMessagesController.sendMessage);
    msg.route('/getInbox').get(UserMessagesController.getInbox);
    msg.route('/seen/:id').get(UserMessagesController.setMessageSeen);
    msg.route('/getHistory/:inboxOrOutbox/:number/:offsetMilliseconds/:beforeOrAfter').get(UserMessagesController.getHistory);
    api.use('/message',msg);
    
    /**
     * Places Routes 
     */
    var place = express.Router();
    place.route('/add').post(UserPlacesController.addNewPlace);
    api.use('/places',place);
    
    /**
     * Violations Routes
     */
    var vio = express.Router();
    vio.route('/add').post(UserViolationsController.addNewViolation);
    api.use('/violations',vio);

    /**
     * Incidents Routes
     */
    var incd = express.Router();
    incd.route('/add').post(UserIncidentController.addNewIncident);
    api.use('/incidents',incd);

    /**
     * Categories Routes 
     */
    var category = express.Router();
    category.route('/:type').get(CategoriesController.getCategoriesList);
    api.use('/categories',category);

    /**
     * Search Routes
     */
    var search = express.Router();
    search.route('/:type/:string').get(MobileSearchController.getResults);
    api.use('/search',search);

    /**
     *  TodoList Routes
     */
    var todolist = express.Router();
    todolist.route('/new').get(UserTodolistController.exportNewTodolists);
    todolist.route('/seen/:id').get(UserTodolistController.setTodolistSeen);
    todolist.route('/save/:id').post(UserTodolistController.saveTodolist);
    api.use('/todolist',todolist);

    /**
     *  Image Route
     */
    var img = express.Router();
    img.route('/:name').get(ImageManagerController.getImage);
    api.use('/image',img);

    /**
     * User Statistics
     */
    var stats = express.Router();
    stats.route('/update').post(UserStatisticsController.updateStats);
    api.use('/statistics', stats);

    /**
     * User Settings Updates
     */
     var settingsUpdates = express.Router();
     settingsUpdates.route('/').get(UserSettingsController.generateSettings);
     settingsUpdates.route('/time').get(UserSettingsController.getTimeSettings);
     api.use('/settings', settingsUpdates);
};
