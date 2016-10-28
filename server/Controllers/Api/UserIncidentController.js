'use strict';
var Validator = useUtil("Validate"),
	Incident = useModel("Instance"),
	IncidentTransformer = useTransformer("IncidentTransformer");
/**
 * [UserIncidentController description]
 */
var UserIncidentController = function(){
	/**
	 * [addNewIncident description]
	 * @param {[type]} req [description]
	 * @param {[type]} res [description]
	 */
	this.addNewIncident = function(req,res){
		// violation object from request
	    var incident = {
	    	title : req.body.title 				|| '',
	    	category : req.body.category 		|| '',
	    	location : req.body.location 		|| '',
	    	address : req.body.address 			|| '',
	    	description : req.body.description 	|| '',
	    	images : req.body.images 			|| '',
	    	time : req.body.time 				|| '',
	    	uploader : getUserObject()._id
		};
		// rules to be validated to
		var rules = {
			title 		: ["required"],
			category 	: ["required"],
			location 	: ["required","array"],
			//address 	: ["required"],
			description : ["required"],
			time 		: ["required","timestamp"]
		};
		// validting the inputs
		Validator.make(incident, rules, function(err){
			// check any errors 
			if(err) res.status(406).json({msg : err});
			else // transform and save the violation object
				Incident.create(IncidentTransformer.transform(incident), function(vio){
					res.status(201).json({ msg : "ok"});
				});
		});
	};
};

module.exports = new UserIncidentController;