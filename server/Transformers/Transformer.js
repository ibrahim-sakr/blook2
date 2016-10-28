'use strict';

var imgman  = useUtil("ImageManager");

/**
 * [Transformer description]
 */
var Transformer = function(){

	/**
	 * [transformCollection description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transformCollection = function(input){
		if(Array.isArray(input))
		{
			return input.map(this.transform);
		}
	};
	
	/**
	 * [transformToObjectID description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transformToObjectID = function(input){
		if(Array.isArray(input))
		{
			input.forEach(function(element,index){
				input[index] = objectId(element);  
			});
			return input;
		}
		else
		{
			return objectId(input);
		}
	};

	/**
	 * [transformToString description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transformToString = function(input){
		if(Array.isArray(input))
		{
			input.forEach(function(element,index){
				input[index] = String(element);
			});
			return input;
		}
		else
		{
			return String(input);
		}
	};

	/**
	 * [transformToDate description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transformToDate = function(input)
	{
		if(Array.isArray(input))
		{
			return input.forEach(function(element,index){
				input[index] = new Date(Number(element));
			});
		}
		else
		{
			return new Date(Number(input));
		}
	};
	
	/**
	 * [transformToBoolean description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transformToBoolean = function(input)
	{
		if(Array.isArray(input))
		{
			return input.forEach(function(input){
				return input = (input=="true") ? true : false;
			});
		}
		else
		{
			return input = (input=="true") ? true : false;
		}
	}

	this.transformToInt = function(input){
		if(Array.isArray(input))
		{
			return input.forEach(function(input){
				return Number(input);
			});
		}
		else
		{
			return Number(input);
		}
	};

	/**
	 * [transformToObject description]
	 * @param  {[type]} input      [description]
	 * @param  {[type]} attributes [description]
	 * @return {[type]}            [description]
	 */
	this.transformToObject = function(input, attributes)
	{
		// attributes are optional
		var attributes = attributes || [];

		// length of input as number of generated objects
		var counter = input.length;
		
		// final output repository
		var output = [];
		
		for (var i = input.length - 1; i >= 0; i--) 
		{
			output[i] = {id : this.transformToObjectID(input[i])};

			if(Object.keys(attributes).length)
			{
				Object.keys(attributes).forEach(function(ele , index){
						output[i][ele] = attributes[ele];
				});
			}
		};
		
		return output;
	};

	/**
	 * [transformToImage description]
	 * @param  {[type]} input      [description]
	 * @param  {[type]} prefixName [description]
	 * @return {[type]}            [description]
	 */
	this.transformToImage = function(input , prefixName){
		
		var ImageManager = new imgman;
		
		if(Array.isArray(input))
		{
			return input.map(function(file){
				 return ImageManager.save(prefixName,file);
			});
		}
		else
		{
			return ImageManager.save(prefixName, input);
		}
	}
;};

module.exports = Transformer;
