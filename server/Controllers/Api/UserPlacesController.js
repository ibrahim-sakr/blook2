'use strict';

var Place 		= useModel("Place"),
	Validator 	= useUtil("Validate"),
	PlaceTransformer = useTransformer("PlaceTransformer");
/**
 * [UserPlacesController description]
 */
var UserPlacesController = function(){
	/**
	 * [addNewPlace description]
	 * @param {[type]} req [description]
	 * @param {[type]} res [description]
	 */
	this.addNewPlace = function(req,res){
		// place object from request
		var place = {
			title 		: String(req.body.title) || '',
			location 	: req.body.location 	 || '',
			category 	: req.body.category 	 || '',
			address 	: req.body.address  	 || '',
			description : req.body.description 	 || '',
			contact 	: req.body.contact 		 || '',
			images 		: req.body.images 		 || '',
			time		: req.body.time 		 || '',
			uploader    : getUserObject()._id         
		};
		// validation rules
		var rules = {
			title    : 	['required'],
			location : 	['required','array'],
			category : 	['required'],
			//address  : 	['required'],
			//description:['required'],
			contact : 	['array'],
			time 	: 	['required','timestamp']
		};

		// validation layer
		Validator.make(place , rules , function(err){
			// check any errors 
			if(err) res.status(406).json({msg : err});
			else // transform and save the place object
				Place.create(PlaceTransformer.transform(place), function(place){
					res.status(201).json({msg : "ok"});
				});
		});
	};
};

module.exports = new UserPlacesController;