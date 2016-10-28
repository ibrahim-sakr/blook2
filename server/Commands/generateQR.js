var QR         = useModel('QR');
var userData   = useCommand('generateUserSettings');
var Config     = useUtil("Config");

var generateQR = function(){
	/**
	 * generate new QR
	 * @param  {object}   data     [must contain {id: GLOBAL.objectId(""), hostname: "", protocol: ""}]
	 * @return {function} callback [description]
	 */
	this.generate = function(data, callBack){
	    // delete from qrcodes where "code" = user_id
	    QR.deleteWhere({ code: data.user_id }, function(doc){
	        // get user data that will save in QR
	        userData.get(data.user_id, function(userdata){
	        	// create new QR
	        	var url = data.protocol +"://"+ data.hostname +":"+  Config.get('port') +"/check/"+ data.user_id;
	        	userdata.data.url = data.protocol +"://"+ data.hostname +":" + Config.get('port');
	        	QR.create(userdata, function(qr){
	        	    qr.url = url;
	        	    return callBack(qr);
	        	});
	        });
	    });
	};
};

module.exports = new generateQR;
