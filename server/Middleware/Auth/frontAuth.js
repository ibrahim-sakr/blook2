'use strict';

var jwtHandler = useUtil('jwt.jwtHandler');
var jwt        = use('jsonwebtoken');
var Config     = useUtil('Config');


module.exports = function(req, res, next){
    // get headers.auth => contains token
    var token  = req.headers.auth || null;
    var secret = Config.get('secret');

    jwt.verify(token, secret, function(err, userObjectFromJWT){
        if (err) {
            console.log("JWT Error " + err);
            return res.status(401).end();
        }
        GLOBAL.UserObject = userObjectFromJWT;
        next();
    });
}
