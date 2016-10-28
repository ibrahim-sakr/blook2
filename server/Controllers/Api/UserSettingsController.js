var User = useModel('User'),
    UserSettingsGenerator = useCommand('generateUserSettings'),
    Branch = useModel('Branch');
/**
 * Controller Manage user updates
 */
var UserSettingsController = function(){
	/**
	 * [generateSettings description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.generateSettings = function(req,res){
		var userId = getUserObject('_id');
		// select where user has updates
		User.where({'_id' : objectId(userId) , update : true},function(user){
			if(!Object.keys(user).length) res.status(204).end();
			else
				// update user update status to false
				User.update({'_id' : objectId(userId)},{update : false}, function(num){
					// generate new settings
					UserSettingsGenerator.get(objectId(userId), function(newUpdates){
						// send it to the user
						res.json(newUpdates);
					});
				});
			
		});
	};

	/**
	 * [getTimeSettings description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.getTimeSettings = function(req,res){
		var branch_id = getUserObject('branch_id');
		Branch.find(branch_id, function(data){
			res.json({
				timezone : data.settings.timezone,
				serverTimer : new Date().getTime()
			});
		});
	}
};

module.exports = new UserSettingsController;