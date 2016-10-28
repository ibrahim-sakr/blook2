'use strict';
var Transformer = useTransformer("Transformer");
/**
 * [ViolationTransformer description]
 */
var IncidentTransformer = function(){
	/**
	 * [transform description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transform = function(input){
		return {
			type   		: "incident",
			uploader    : this.transformToObjectID(input.uploader),
			title 		: this.transformToString(input.title),
			category 	: this.transformToObjectID(input.category),
			location 	: this.transformToString(input.location),
			address 	: this.transformToString(input.address),
			description : this.transformToString(input.description),
			images 		: this.transformToImage(input.images,'incidents'),
			time 		: this.transformToDate(input.time)
		};
	};
};

IncidentTransformer.prototype = new Transformer;
module.exports = new IncidentTransformer;