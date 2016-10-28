'use strict';
var config = require('../Utilities/Config');
var fs = require('fs');
var Image64Decoder = require('./Image64Decoder');

/**
 * [ImageManager description]
 * @param {[type]} client [description]
 * @param {[type]} folder    [description]
 * @param {[type]} ext       [description]
 */
var ImageManager = function(client , folder, ext){
	var self = this;
	var subfolder = (client) ? client : require('../App').get('client'),
		folder = (folder) ? folder : config.get('uploads'),
		destination = fs.realpathSync(folder + '/' + subfolder),
		dirs = ['places','violations','incidents','todolists','users'],
		extension = (ext) ? ext : '.jpeg';
		
	return {
		/**
		 * [save description]
		 * @param  {[type]} folder [description]
		 * @param  {[type]} image  [description]
		 * @return {[type]}        [description]
		 */
		save : function(folder ,image){
			if(dirs.indexOf(folder) >= 0)
			{
				var name =	folder + '_' + new Date().getTime() + '_' + Math.floor((Math.random()*100)+1) + extension;
				var finalName =  destination + '/' + folder + '/'+ name ;
				var image = Image64Decoder.decode(image);
				fs.writeFileSync(finalName,image);
				return name;
			}			
			else
				throw "requird folder does not exist";
		},

		/**
		 * [get description]
		 * @param  {[type]}   name [description]
		 * @param  {Function} cb   [description]
		 * @return {[type]}        [description]
		 */
		get : function(name, cb){
			if(!/^[a-z]+(_)[0-9]+(_)[0-9]{1,3}/.test(name))
				throw "unsupported image name format";
			var all = name.split('_');
			var folder = all[0];
			if(dirs.indexOf(folder) < 0)
				throw "image filename contains invalid folder structure";

			fs.readFile(destination  +'/' + folder + '/' + name , function(err , data){
				return cb(err,data);
			});

		},

		/**
		 * [delete description]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		delete : function(name){

			if(!/^[a-z]+(_)[0-9]+(_)[0-9]{1,3}/.test(name))
				throw "unsupported image name format";
			var all = name.split('_');
			var folder = all[0];
			if(dirs.indexOf(folder) < 0)
				throw "image filename contains invalid folder structure";

			fs.unlink(destination + '/' + folder + '/' + name, function(err){
				if(err) throw err;
				return true;
			});
		}
	}
};

module.exports = ImageManager;