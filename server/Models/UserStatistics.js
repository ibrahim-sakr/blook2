'use strict';
var Model = useModel("Model");
/**
 * UserStatistics Model
 */
function UserStatistics(){
    this.collection = 'user_statistics';
}
UserStatistics.prototype = new Model;
module.exports = new UserStatistics;
