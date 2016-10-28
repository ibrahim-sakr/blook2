var Model   = useModel('Model');

/**
 * Category Model
 */
function Category(){
    this.collection = 'categories';
}
Category.prototype = new Model();
module.exports = new Category;

