'use strict';

var app         = use('../App'),
    MongoClient = use('mongodb').MongoClient,
    Config      = useUtil('Config');

module.exports = function(req, res, next){
    var database = Config.get('database.' + req.subdomains[0]);
    MongoClient.connect('mongodb://'+ database.host +':'+ database.port +'/'+ database.name).then(function(db){
        app.set('db', db);
        next();
    });
}
