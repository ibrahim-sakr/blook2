'use strict';

var jwtHandler = useUtil('jwt.jwtHandler');
/**
 * Authticate Request headers against JWT token 
 * @param  {Http Request}    req  	
 * @param  {Http Response}   res  	
 * @param  {function} 		 next 	        
 * @return         					[Call Next Middleware]
 */
module.exports = function(req, res, next){
    // get cookie.token
    var token = req.headers.token || null;
    if ( !jwtHandler.check(token) ) {
        return res.status(401).send('Unauthorized');
    }
    req.globalJwt = token;
    next();
}
