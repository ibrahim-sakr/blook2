'use strict';
var Model   = useModel('Model');
/**
 * UserTodolist Model
 */
function UserTodolist(){
    this.collection = 'user_todolists';
}
UserTodolist.prototype = new Model;
module.exports = new UserTodolist;
