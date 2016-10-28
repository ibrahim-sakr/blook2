'use strict';
var Validator 				  = useUtil("Validate"),
	UserStatistics 			  = useModel('UserStatistics'),
	UserStatisticsTransformer = useTransformer('UserStatisticsTransformer');
/**
 * [UserStatisticsController description]
 */
var UserStatisticsController = function(){
	
	/**
	 * [updateStats description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.updateStats = function(req,res){
		// request object
		var stats = {
			time  			: req.body.time || '', 
			location  		: req.body.location || '',
			speed  			: req.body.speed || '',
			wifi_status  	: req.body.wifi_status || '',
			gps_status  	: req.body.gps_status || '',
			ps_status  		: req.body.ps_status || '',
			battery_level  	: req.body.battery_level || '',
			time_change  	: req.body.time_change || '',
			cell_id  		: req.body.cellId || '',
			user 			: getUserObject()._id
		};
		// validator rules
		var rules = {
			time 			: ['required','timestamp'],
			location 		: ['required','array'],
			speed 			: ['required','numeric'],
			battery_level 	: ['required','numeric'],
			wifi_status 	: ['required','boolean'],
			gps_status 		: ['required','boolean'],
			ps_status 		: ['required','boolean'],
			time_change 	: ['required','boolean'],
			cell_id 		: ['required']
		};
		// validating request against rules
		Validator.make(stats , rules , function(err){
			if(err) res.status(406).send({msg : err});
			else
				UserStatistics.create(UserStatisticsTransformer.transform(stats));
				res.status(201).json({msg : "ok"});
		});
	};
};

module.exports = new UserStatisticsController;