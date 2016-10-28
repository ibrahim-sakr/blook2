var User = useModel("User");

/**
 * Notify users for updating
 */
var notifyUpdate = function(){
	this.send = function(ids, callback){
		var obj = {};
		if (ids && Array.isArray(ids)) obj = { _id: { $in: ids } };
		else if (typeof ids === "object") obj = { _id: ids };

		User.update(obj, {
			update: true
		}, function(data){
			if (typeof callback === "function") return callback(data);
		})
	};
};
module.exports = new notifyUpdate;
