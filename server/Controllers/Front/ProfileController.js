var User = require('../../Models/User');
var ObjectID = require('mongodb').ObjectID;

/*
 * Profile Controller
 */
ProfileController = {
    index: function(req, res){
        // User.find('55d8b9891302748851b431df', function(user){
        //     res.json(user);
        // });
        // User.create({
        //     name: "kamal",
        //     "password": "12345+6",
        //     "address": "sfgdfhfjfhj"
        // }, function(docs){
        //     res.json(docs);
        // });
        // User.where({}, function(docs){});
        // User.delete('55faf35b60c8059e10648dca', function(docs){
        //     res.json(docs);
        // });
        // User.hardDelete('55faf35b60c8059e10648dca', function(docs){
        //     res.json(docs);
        // });
        // 
        User.getMessages('55dafba990a74fc51aa8f487', function(messages){
            res.json(messages);
        });
    },
    update: function(req, res){},
}
module.exports = ProfileController;
