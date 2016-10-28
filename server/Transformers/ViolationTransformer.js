'use strict';
var Transformer = useTransformer("Transformer");
/**
 * [ViolationTransformer description]
 */
var ViolationTransformer = function(){
	/**
	 * [transform description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transform = function(input){
		return {
			type   		: "violation",
			uploader    : this.transformToObjectID(input.uploader),
			title 		: this.transformToString(input.title),
			category 	: this.transformToObjectID(input.category),
			location 	: this.transformToString(input.location),
			address 	: this.transformToString(input.address),
			description : this.transformToString(input.description),
			violator 	: this.transformToString(input.violator),
			images 		: this.transformToImage(input.images,'violations'),
			time 		: this.transformToDate(input.time)
		};
	};
};

ViolationTransformer.prototype = new Transformer;
module.exports = new ViolationTransformer;