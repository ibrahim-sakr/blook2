var Model   = useModel('Model');

/**
 * Privilege Model
 */
function Privilege(){
    this.collection = 'privileges';
}
Privilege.prototype = new Model();
module.exports = new Privilege;

