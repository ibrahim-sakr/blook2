var Cache = require('../Cache');

function jwtCacheRetriever(token){
    if (token) {
        var valid = Cache.get(token);
        if ( valid === false ) {
            return false;
        };
        return true;
    } else {
        throw "No token provided";
    }
}

module.exports = new jwtCacheRetriever;
