'use strict';
var Transformer = useTransformer("Transformer");
/**
 * [MessageDateTransformer description]
 */
var MessageDateTransformer = function(){
	/**
	 * [transform description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transform = function(input){
		input.sent_at = new Date(input.sent_at).getTime();
		return input;
	};
};

MessageDateTransformer.prototype = new Transformer;
module.exports = new MessageDateTransformer;