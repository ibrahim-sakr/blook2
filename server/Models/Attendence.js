var Model   = useModel('Model');

/**
 * User Model
 */
function Attendence(){
    this.collection = 'attendence';
};
Attendence.prototype = new Model;
module.exports = new Attendence;

