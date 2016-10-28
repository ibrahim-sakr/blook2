'use strict';

var Transformer = useTransformer('Transformer');
var Validator   = useUtil('Validate');
/**
 * [TodolistTransformer description]
 */
var TodolistTransformer = function(){
	var self = this;
	
	/**
	 * [transform description]
	 * @param  {[type]} input [description]
	 * @return {[type]}       [description]
	 */
	this.transform = function(input, cb){
		switch(input.type){

			case 'text':
					return this.transformTextBox(input, cb);
				break;
			case 'menu':
					return this.transformToMenu(input, cb);
				break;
			case 'upload':
					return this.transformUpload(input, cb);
				break;
			case 'checkbox':
					return this.transformCheckBox(input, cb);
				break;
			case 'textarea':
					return this.transformTextArea(input, cb);
				break;
			default :
				return  cb("unknow todolist compment");	


		}

	};
	
	/**
	 * [transformTextBox description]
	 * @param  {[type]} textBox [description]
	 * @return {[type]}         [description]
	 */
	this.transformTextBox = function(textBox, callback){
		var rules = {
			index 		: ['required','numeric'],
			type  		: ['required', 'equals:text'],
			value 		: ['required'],
        	time  		: ['required', 'timestamp'],
        	location 	: ['required','array']
		};

		Validator.make(textBox , rules, function(err){
			return callback(err,{
					index 		: self.transformToInt(textBox.index),
					type  		: self.transformToString(textBox.type),
					value 		: self.transformToString(textBox.value),
					time  		: self.transformToDate(textBox.time),
					location 	: self.transformToString(textBox.location)
			});
		}, callback);
	};

	/**
	 * [transformTextArea description]
	 * @param  {[type]} textArea [description]
	 * @return {[type]}          [description]
	 */
	this.transformTextArea = function(textArea, callback){
		var rules = {
			index 		: ['required','numeric'],
			type  		: ['required', 'equals:textarea'],
			value 		: ['required', 'max:200'],
        	time  		: ['required', 'timestamp'],
        	location 	: ['required','array']
		};

		Validator.make(textArea , rules, function(err){
			return callback(err,{
					index 		: self.transformToInt(textArea.index),
					type  		: self.transformToString(textArea.type),
					value 		: self.transformToString(textArea.value),
					time  		: self.transformToDate(textArea.time),
					location 	: self.transformToString(textArea.location)
				});
		}, callback);
	};

	/**
	 * [transformCheckBox description]
	 * @param  {[type]} checkbox [description]
	 * @return {[type]}          [description]
	 */
	this.transformCheckBox = function(checkbox, callback){
		var rules = {
			index 		: ['required','numeric'],
			type  		: ['required', 'equals:checkbox'],
			value 		: ['required', 'boolean'],
        	time  		: ['required', 'timestamp'],
        	location 	: ['required','array']
		};

		Validator.make(checkbox , rules, function(err){
			return callback(err,{
					index 		: self.transformToInt(checkbox.index),
					type  		: self.transformToString(checkbox.type),
					value 		: self.transformToBoolean(checkbox.value),
					time  		: self.transformToDate(checkbox.time),
					location 	: self.transformToString(checkbox.location)
				});
		}, callback);	
	};

	/**
	 * [transformUpload description]
	 * @param  {[type]} file [description]
	 * @return {[type]}      [description]
	 */
	this.transformUpload = function(file, callback){
		var rules = {
			index 		: ['required','numeric'],
			type  		: ['required', 'equals:upload'],
			value 		: ['required'],
        	time  		: ['required', 'timestamp'],
        	location 	: ['required','array']
		};

		Validator.make(file , rules, function(err){
			return callback(err,{
					index 		: self.transformToInt(file.index),
					type  		: self.transformToString(file.type),
					value 		: self.transformToImage(file.value,'todolists'),
					time  		: self.transformToDate(file.time),
					location 	: self.transformToString(file.location)
					});
			}, callback);	
	};

	/**
	 * [transformToMenu description]
	 * @param  {[type]} menu [description]
	 * @return {[type]}      [description]
	 */
	this.transformToMenu = function(menu, callback){
		var rules = {
			index 		: ['required','numeric'],
			type  		: ['required', 'equals:menu'],
			value 		: ['required'],
        	time  		: ['required', 'timestamp'],
        	location 	: ['required','array']
		};

		Validator.make(menu , rules, function(err){
			return callback(err,{
					index 		: self.transformToInt(menu.index),
					type  		: self.transformToString(menu.type),
					value 		: self.transformToString(menu.value),
					time  		: self.transformToDate(menu.time),
					location 	: self.transformToString(menu.location)
					});
			}, callback);	
	};
};

TodolistTransformer.prototype = new Transformer;
module.exports = new TodolistTransformer;