'use strict';
var Validator = useUtil("Validate"),
	Violation = useModel("Instance"),
	ViolationTransformer = useTransformer("ViolationTransformer");
/**
 * [UserViolationsController description]
 */
var UserViolationsController = function(){
	/**
	 * [addNewViolation description]
	 * @param {[type]} req [description]
	 * @param {[type]} res [description]
	 */
	this.addNewViolation = function(req, res){
	    // violation object from request
	    var violation = {
	    	title : req.body.title 				|| '',
	    	category : req.body.category 		|| '',
	    	location : req.body.location 		|| '',
	    	address : req.body.address 			|| '',
	    	description : req.body.description 	|| '',
	    	violator : req.body.violator 		|| '',
	    	images : req.body.images 			|| '',
	    	time : req.body.time 				|| '',
	    	uploader : getUserObject()._id
		};
		// rules to be validated to
		var rules = {
			title 		: ["required"],
			category 	: ["required"],
			location 	: ["required","array"],
			description : ["required"],
			//address 	: ["required"],
			//violator 	: ["required"],
			time 		: ["required","timestamp"]
		};
		// validting the inputs
		Validator.make(violation, rules, function(err){
			// check any errors 
			if(err) res.status(406).json({msg : err});
			else // transform and save the violation object
				Violation.create(ViolationTransformer.transform(violation), function(vio){
					res.status(201).json({ msg : "ok"});
				});
		});
	};
};

module.exports = new UserViolationsController;