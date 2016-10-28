'use strict';

var Transformer = useTransformer("Transformer");
/**
 * Place Transformer Api request input of place to Database set to be saved
 */
var PlaceTransformer = function(){
	/**
	 *  @param {Object} input 	[Api Request Object of place]
     * @return {Object} 		[Database Model of database]
	 */
	this.transform = function(input){
		return{
			uploader		: this.transformToObjectID(input.uploader)				 ,
			title 			: this.transformToString(input.title) 				|| '',
			location 		: this.transformToString(input.location) 			|| '',
			category 		: this.transformToObjectID(input.category) 			|| '',
			address 		: this.transformToString(input.address)  			|| '',
			description 	: this.transformToString(input.description)			|| '',
			contact : {
				   name 	: this.transformToString(input.contact[0]) 			|| '',
				   number 	: this.transformToString(input.contact[1]) 			|| ''
			},
			images 			: this.transformToImage(input.images,"places") 		|| '',
			time			: this.transformToDate(input.time)  				|| ''
		};
	}
};

PlaceTransformer.prototype = new Transformer;
module.exports = new PlaceTransformer;