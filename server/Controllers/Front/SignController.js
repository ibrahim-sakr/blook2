var app         = customUse('App'),
    Bcrypt      = use('bcryptjs'),
    jwt         = use('jsonwebtoken'),
    Cache       = useUtil('Cache'),
    Validate    = useUtil('Validate'),
    Config      = useUtil('Config'),
    jwtHandler  = useUtil('jwt.jwtHandler'),
    User        = useModel('User');

/*
 * User Attendence Controller
 */
SignController = {
    in: function(req, res){
        // retrive data.
        var user = {
            mobile:   req.body.mobile   || '',
            password: req.body.password || ''
        };
        // validate object
        methods = {
            mobile:   ['required', 'numeric'],
            password: ['required']
        };
        Validate.make(user, methods, function(errs){
            // return res.status(403).json(errs);
            if (errs) return res.status(403).end();

            // search for user in DB.
            User.where({mobile: user.mobile}, function(dbuser){
                // User Not Found
                if (!dbuser.length) return res.status(403).end();

                // User Found
                var dbuser = dbuser[0];

                // check password.
                Bcrypt.compare(user.password, dbuser.password, function(err, result) {
                    // Password Incorrect
                    if (!result) return res.status(403).end();

                    // Password Good
                    // create user object.
                    User.object(dbuser._id, function(userObject){

                        // create new token
                        var newToken = jwt.sign( userObject, Config.get('secret') );

                        // save new token
                        // jwtHandler.save(newToken);

                        // exclude some data from user object before send it to device
                        delete userObject.branch._id;
                        delete userObject.position_id;
                        delete userObject.branch_id;
                        userObject.privliges.forEach(function(ele, index){
                            delete userObject.privliges[index]._id;
                            delete userObject.privliges[index].display_name;
                        });

                        // send token and userObject to browser
                        var data = {
                            auth: newToken,
                            user: userObject
                        };
                        return res.status(200).json(data);
                    });
                });
            });
        });

    },
    // out: function(req, res){
    //     // get token
    //     var token = req.headers.auth;

    //     // remove token from savedJWT
    //     jwtHandler.delete(token);

    //     return res.status(200).end();
    // }
}
module.exports = SignController;
