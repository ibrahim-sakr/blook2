
var jwtGenerator    = require('jsonwebtoken');
var QR 				= useModel("QR");
var User 			= useModel("User");
var jwtHandler		= useUtil("jwt.jwtHandler");
var Config 			= useUtil("Config");
var UserSettingsGenerator = useCommand('generateUserSettings');

var QRCheckerController = function(){

	this.check = function(req, res){
		var code = req.params.code || null;
		// user default attributes
		var attr = {
			imei : req.body.imei   || null,
			imsi : req.body.imsi   || null,
			model : req.body.mobileModel || null,
			version : req.body.version || null
		};
		
		if(attr.imsi && attr.imei){

			// update user data
			User.update({_id : objectId(code)}, {attr},function(user){
				if(user.modifiedCount != 0)
				{
					// select and update the requested qr code
					QR.update({code: objectId(code), active : true},{active : false}, function(updatedQr){
						if(updatedQr.modifiedCount != 0)
						{
							// generate new jwt key for the sure
							// code here is the same as user id
							var newToken = jwtGenerator.sign(code, Config.get('secret'));
							// save the token
							jwtHandler.save(newToken);
							// select the related data to this qr code
							QR.where({code : objectId(code)}, function(qr){
								
								UserSettingsGenerator.get(objectId(code), function(data){
								    // this line should be remove in production
								    data.data.url = req.protocol + '://' + req.get('host').replace(":","_");
									// sending the response to the mobile
									return res.json({token : newToken , data : data.data});
								})
							});
						}
						else
						{
							// in case this code has been used already
							return res.status(404).json({msg : "invalid qr code"});
						}

					});
				}
				else
				{
					// in case this user is not found
					return res.status(400).json({msg : "invalid qr code"});
				}
			});
		}
		else
		{
			return res.status(400).json({msg : "invalid request , missing imei or imsi"});
		}
	};

};

module.exports = new QRCheckerController();