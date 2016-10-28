'use strict';

var Transformer = useTransformer("Transformer");
/**
 * [MessageTransformer description]
 */
var MessageTransformer = function(){
	
	/**
	 * [transform description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transform = function(input){
		
		return {
			sender   : this.transformToObjectID(input.sender), 
			reciever : this.transformToObject(input.reciever, {seen : false , sent : false}),
			title    : this.transformToString(input.title),
			body     : this.transformToString(input.body),
			sent_at  : this.transformToDate(input.sent_at)
		}
	};
};

MessageTransformer.prototype = new Transformer;
module.exports = new MessageTransformer; 