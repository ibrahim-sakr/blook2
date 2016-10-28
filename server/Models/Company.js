var Model   = useModel('./Model');

/**
 * Group Model
 */
function Company(){
    this.collection = 'company';
}
Company.prototype = new Model;
module.exports = new Company;
