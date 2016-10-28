var Model = useModel('Model');

/**
 * User Model
 */
function Instance(){
    this.collection = 'instances';
}
Instance.prototype = new Model;
module.exports = new Instance;

