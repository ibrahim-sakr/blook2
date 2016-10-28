var Log = useModel('Log');

/*
 * Logger Controller
 */
LoggerController = function(){

	this.save = function(req, res){
		req.body.userId = (req.body.userId) ? GLOBAL.objectId(req.body.userId): "";
		req.body.time   = req.body.time.toString();
		Log.create(req.body, function(data){
			return res.status(200).end();
		});
	};

}
module.exports = new LoggerController;
