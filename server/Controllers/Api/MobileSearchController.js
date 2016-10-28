'use strict';
var Instance = useModel('Instance'),
	Place    = useModel('Place');

/**
 * [MobileSearchController description]
 */
var MobileSearchController = function(){
	/**
	 * [getResults description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.getResults = function(req,res){

		// define the type of search
		var type = req.params.type;
		// search string to Regexp and ignore case
		var string = new RegExp(req.params.string,"i");
		if(type == 'violation' || type == 'incident')
			// select from instances 
			Instance.where({where:{type : type, title : string} ,filter:{branch_id : 0 , region_id : 0,uploader:0, _id : 0}}, function(results){
				if(results.length)
					res.json(results);
				else
					res.status(204).end();
			});
		else if(type == 'place')
			Place.where({where :{"title" : string}, filter:{branch_id : 0 , region_id : 0,uploader:0, _id :0}},function(results){
				if(results.length)
					res.json(results);
				else
					res.status(204).end();
			});
		else
			res.status(406).json({msg : "invalid type of search "});

	};
};

module.exports = new MobileSearchController;