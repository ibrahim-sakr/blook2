var Config = useUtil('Config');


function jwtHandler(){
    var handler = {};
    construct();

    function construct(){
        var storage = Config.get('jwtStorage');
        if (storage == "file") {
            handler = require('./jwtFileRetriever');
        }
        if (storage == "cache") {
            handler = require('./jwtCacheRetriever');
        }
    }

    this.check = function(token){
        return handler.check(token);
    };
    this.save = function(token){
        return handler.save(token);
    };
    this.delete = function(token){
        return handler.delete(token);
    }

}
module.exports = new jwtHandler;