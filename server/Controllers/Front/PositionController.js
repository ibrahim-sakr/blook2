var Position = require('../../Models/Position'),
    Config = require('../../Utilities/Config');

/*
 * Positions Controller
 */
PositionController = function(){
    this.index = function(req, res){
        if( !userCan("view_authintications") ) return res.status(401).end();

        var pagination = req.query.pagination == 'all' ? null : Config.get('pagination');
        Position.all({
            privileges: 0
        }, function(positions){
            return res.json(positions);
        }, pagination);
    };

    this.find = function(req, res){
        if( !userCan("view_profile_authintications") ) return res.status(401).end();

        Position.find(GLOBAL.objectId(req.params.id), function(doc){
            return res.json(doc);
        });
    };

    this.update = function(req, res){
        if( !userCan("edit_authintications") ) return res.status(401).end();

        req.body.privileges_id = req.body.privileges_id.map(function(priv){
            return GLOBAL.objectId(priv);
        });

        Position.updateOneByReplace(GLOBAL.objectId(req.params.id), req.body, function(doc){
            if (doc.modifiedCount >= 1) {
                return res.json({
                    status: doc.result.ok,
                    modifiedCount: doc.modifiedCount
                });
            } else {
                return res.status(400).end();
            }
        });

    },

    this.delete = function(req, res){
        if( !userCan("delete_authintications") ) return res.status(401).end();

        Position.delete(GLOBAL.objectId(req.params.id), function(data){
            return res.json(data);
        });
    };

    this.create = function(req, res){
        if( !userCan("add_authintications") ) return res.status(401).end();

        req.body.privileges = req.body.privileges_id.map(function(priv){
            return GLOBAL.objectId(priv);
        });
        Position.create(req.body, function(newPosition){
            return res.json(newPosition);
        });
    };
}
module.exports = new PositionController;
