'use strict';
var Transformer = useTransformer('Transformer');
/**
 * [UserStatisticsTransformer description]
 */
var UserStatisticsTransformer = function(){

	/**
	 * [transform description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transform = function(input){
		return {
			user            : this.transformToObjectID(input.user),
			time  			: this.transformToDate(input.time),
			location  		: this.transformToString(input.location),
			speed  			: this.transformToString(input.speed),
			wifi_status  	: this.transformToBoolean(input.wifi_status),
			gps_status  	: this.transformToBoolean(input.gps_status),
			ps_status  		: this.transformToBoolean(input.ps_status),
			battery_level  	: this.transformToString(input.battery_level),
			time_change  	: this.transformToBoolean(input.time_change),
			cell_id			: this.transformToString(input.cell_id)
		};
	};
};

UserStatisticsTransformer.prototype = new Transformer
module.exports = new UserStatisticsTransformer;
