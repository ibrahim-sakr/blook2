var Model   = useModel('Model');

/**
 * User Model
 */
function Todolist(){
    this.collection = 'todolists';
}
Todolist.prototype = new Model;
module.exports = new Todolist;

