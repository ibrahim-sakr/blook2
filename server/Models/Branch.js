var Model   = useModel('Model');

/**
 * User Model
 */
function Branch(){
    this.collection = 'branchs';
}
Branch.prototype = new Model;
module.exports = new Branch;

