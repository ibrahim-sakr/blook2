'use strict';

/**
 * Inject JWT string into all responses that sends to browsers.
 * @param  {Http Request}    req   
 * @param  {Http Response}   res    
 * @param  {function}        next           
 * @return                          [Call Next Route]
 */
module.exports = function(req, res, next){
	res.set('auth', req.globalJwt);
	// console.dir(res.locals);
    // res.body = { jwt: req.globalJwt };
    next();
}
