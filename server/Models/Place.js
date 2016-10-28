var app     = require('../App'),
    Model   = require('./Model');

/**
 * User Model
 */
function Place(){
    this.collection = 'places';
}
Place.prototype = new Model;
module.exports = new Place;

