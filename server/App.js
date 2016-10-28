'use strict';


/**
 * load Helper Functions
 */
require('./Utilities/helper');

/**
 * Load Main Classes
 */
var expressApp      = use('express'),
    app             = module.exports = expressApp(),
    Config          = useUtil('Config'),
    favicon         = use('serve-favicon'),
    bodyParser      = use('body-parser'),
    DB              = useMiddle('DBConnection'),
    frontAuth       = useMiddle('Auth.frontAuth'),
    authObject      = useMiddle('authObject'),
    path            = use('path'),
    Logger          = useController('Front.LoggerController'),
    pmx             = require("pmx");


/**
 * PMX 
 */
if(Config.env() == "production"){
    pmx.init({
      http          : true, // HTTP routes logging (default: true)
     // ignore_routes : [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
      errors        : true, // Exceptions loggin (default: true)
      custom_probes : true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
      network       : true, // Network monitoring at the application level
      ports         : true  // Shows which ports your app is listening on (default: false)
    });
}

/**
 * Caching views
 * enable for production
 * disable for development
 */
if (Config.env() == "development") app.disable('view cache');
if (Config.env() == "production") app.enable('view cache');

/**
 * disable express ads in HTTP header
 * disable for development
 * enable for production
 */
if (Config.env() == "development") app.disable('x-powered-by');
if (Config.env() == "production") app.enable('x-powered-by');

/**
 * console.log request info.
 * enable fo rdevelopment
 */
if (Config.env() == "development") {
    var morgan = use('morgan');
    app.use(morgan('dev'));
}

/**
 * middlewares MUST call next(); to allow app continue working.
 *
 * app.use(Middleware1, Middleware2, Middleware3);
 *
 * @favicon               => load Favicon
 * @express.static()      => set assets folder.
 * @bodyParser.urlencoded => encode http header request to be easy to deal with.
 * @bodyParser.json       => use JSON.stringify() to make body of request as json string.
 */
app.use(favicon('public/app/BlookModule/imgs/favicon.ico'));
app.use(expressApp.static('./public'));
app.use(bodyParser.urlencoded({ limit : '50mb',extended: false }));
app.use(bodyParser.json({limit : '50mb'}));

/**
 * load our Routes Engine
 * it comes in two parts
 *
 * @ApiRoutes   => handle all requests that come from mobile.
 * @FrontRoutes => handle all requests that come from browsers.
 */
app.post("/logger", DB, Logger.save);
useRoute('ApiRoutes')();
useRoute('FrontRoutes')();

app.use(function(req, res, next){
    if (req.subdomains.length && Config.get('database.' + req.subdomains[0])) {
        next();
    } else {
        return res.sendFile(path.resolve() + '/public/website.html');
    }
});

/**
 * Wep App Home Page
 * @middleware {object} frontAuth   check user authintication and if all good start running Angular JS
 * @middleware {object} DB          set database connection
 * @middleware {object} authObject  create user object and make it Global
 * @param      {object} req         HTTPRequest that comes from Angular JS
 * @param      {object} res         the response that will send to browser
 * @return     {string}             rendered html
 * @discription                     this middlewarre For Angular JS Only it's redirect any http request to our home page
 */
app.use(DB);
app.use(function(req, res, next){
    // return with home page html
    res.sendFile(path.resolve() + '/public/app.html');
});

/**
 * make our application run on port 1234
 */
app.listen(Config.get('port'), function(){
    console.log("app working on http://organizationone."+Config.get('url')+":"+ Config.get('port'));
});
/**********************/
    // HAVE FUN //
/**********************/
