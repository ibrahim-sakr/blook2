var fs = use('fs');
var User = useModel("User");

/*
 * Language Controller
 */
LanguageController = function(){

    this.getLang = function(req, res){
        User.find({
            _id: GLOBAL.getUserObject("_id"),
            filter: {
                webpref: 1
            }
        }, function(user){
            // in case the admin has not web prefernces yet
            if(!user.webpref) 
                var lang = 'en-US'; // default lang
            else
                var lang = user.webpref.lang;
            
            // load lang file
            fs.readFile(__dirname + "/../../i18n/local_"+ lang +".js", 'utf8', function (err, data) {
                if (err) throw err;
                // send it to browser
                return res.json( JSON.parse(data) );
            });
        });
    };

}
module.exports = new LanguageController;
