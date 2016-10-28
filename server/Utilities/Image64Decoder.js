'use strict';

/**
 * Decodes and save Image from Base64Encoded buffer
 */
var Image64Decoder = function(){
  	/**
  	 * @param  {String} filename 	[filename to be saved jpeg file]
  	 * @param  {String} buffer   	[base64encoded buffer]
  	 * @return {Boolean}          	
  	 */
	this.decode = function(buffer){
          return new Buffer(buffer , 'base64');
	     };
};

module.exports = new Image64Decoder;