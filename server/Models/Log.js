var Model = useModel('Model');

/**
 * Log Model
 */
function Log(){
    this.collection = 'log';
}
Log.prototype = new Model;
module.exports = new Log;

