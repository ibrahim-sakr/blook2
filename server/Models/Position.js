var Model   = useModel('Model');

/**
 * Position Model
 */
function Position(){
    this.collection = 'positions';
}
Position.prototype = new Model();
module.exports = new Position;