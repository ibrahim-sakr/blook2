'use strict';

var Category = useModel("Category");

/**
 * [CategoriesController description]
 */
var CategoriesController = function(){
	/**
	 * [getCategoriesList description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.getCategoriesList = function(req,res){
		// request type 
		var type = req.params.type;

		// selecting all categories matching the requested type
		Category.where({type : type}, function(cats){
			if(cats.length)
				res.json(cats);
			else
				res.status(204).end();
		});
	};
};

module.exports = new CategoriesController;