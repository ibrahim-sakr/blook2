var Privilege = require('../../Models/Privilege');

/*
 * Privilege Controller
 */
PrivilegeController = function(){
    this.index = function(req, res){
        Privilege.all({}, function(privileges){
            return res.json(privileges);
        });
    };
    this.find = function(req, res){};
    this.update = function(req, res){};
    this.delete =function(req, res){};
}
module.exports = new PrivilegeController;
