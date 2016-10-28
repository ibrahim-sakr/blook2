'use strict';
var app = require('../App');
/**
 * Set Client's domain as gloabl to able t fetch it from the image manager
 */
module.exports = function(req, res, next){
   var client = req.subdomains[0];
   app.set('client',client);
   next();
};
