'use strict';
var ImageManager = useUtil("ImageManager");
/**
 * [ImageManagerController description]
 */
var ImageManagerController = function(){
	/**
	 * [getImage description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.getImage = function(req, res){
		
		var imgman = new ImageManager;
		
		imgman.get(req.params.name, function(err,image){
			if(err) res.status(404).end();
			else
				res.set({
					'Content-Type' : 'image/jpeg'
				});
				res.end(image,'binary');
		});		

	};
};

module.exports = new ImageManagerController;