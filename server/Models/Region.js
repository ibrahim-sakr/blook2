var app     = require('../App'),
    Model   = require('./Model');

/**
 * User Model
 */
function Region(){
    this.collection = 'regions';
}
Region.prototype = new Model;
module.exports = new Region;

