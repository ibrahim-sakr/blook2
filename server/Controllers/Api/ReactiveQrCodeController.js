'use strict';
var QR 		 = useModel("QR");

var ReactiveQrCodeController = function(){

	this.active = function(req,res){
		var code = req.params.code;
		if(code){
			QR.where({code : objectId(code)},function(qr){
				QR.update({_id : qr._id},{active : true}, function(e){
					if(e)
					{
						res.json("all good man");
					}
				});
			});
		}
	};
} 

module.exports = new ReactiveQrCodeController;