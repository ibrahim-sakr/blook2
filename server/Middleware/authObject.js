'use strict';

var jwt         = use('jsonwebtoken');
var Config      = useUtil('Config');
var User        = useModel('User');
/**
 * Creates Authticated User Object with the required data
 * @param  {Http Request}    req   
 * @param  {Http Response}   res    
 * @param  {function}        next           
 * @return                          [Call Next Route]
 */
module.exports = function(req, res, next){
    if (req.globalJwt) {
        var secret = Config.get('secret');
        try {
            var id = jwt.verify(req.globalJwt, secret);
            console.log(id);
            return res.end();
        } catch(err) {
            return res.status(406).send("invalid token " + err);
        }
    } else {
        res.status(401);
        next();
    }
}
