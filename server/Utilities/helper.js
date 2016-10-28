/**
 * Load DotEnv
 */

require('dotenv').load();

var ObjectID = require('mongodb').ObjectID;
/**
 * set of helper functions
 * no need to require this file its global
 */
var helper = function(){

    /**
     * parse name
     */
    function parse(name){
        return name.replace(".", "/");
    };

    /**
     * just alias for require method
     */
    GLOBAL.use = function(name){
        return require(name);
    };

    /**
     * load/require custom module in a custom folder
     */
    GLOBAL.customUse = function(module){
        return use(__dirname + "/../../server/" + parse(module));
    };

    /**
     * load/require Model
     */
    GLOBAL.useModel = function(model){
        return customUse("Models/" + parse(model));
    }

    /**
     * load/require Command
     */
    GLOBAL.useCommand = function(com){
        return customUse("Commands/" + parse(com));
    }

    /**
     * load/require Transform
     */
    GLOBAL.useTrans = function(transform){
        return customUse("Transformers/" + parse(transform));
    }

    /**
     * load/require Controller
     */
    GLOBAL.useController = function(controller){
        return customUse("Controllers/" + parse(controller));
    }

    /**
     * load/require Utility
     */
    GLOBAL.useUtil = function(util){
        return customUse("Utilities/" + parse(util));
    }

    /**
     * Load a cumstom Transformer
     */
    GLOBAL.useTransformer = function(transform){
        return customUse("Transformers/" + parse(transform));
    };

    /**
     * load/require Middleware
     */
    GLOBAL.useMiddle = function(middle){
        return customUse("Middleware/" + parse(middle));
    }
    
    /**
     * load/require Events
     */
    GLOBAL.useEvent = function(event){
        return customUse("Events/" + parse(event));
    }

    /**
     * load/require Routes
     */
    GLOBAL.useRoute = function(route){
        return customUse("Routes/" + parse(route));
    }

    /**
     * Authenticated User Object
     */
    GLOBAL.getUserObject = function(property){
        if(GLOBAL.UserObject) {
            if(!property)
                return GLOBAL.UserObject;
            else if (typeof property !== "undefined") {
                var segments = property.split(".");
                var config = GLOBAL.UserObject;
                segments.forEach(function(segment){
                    if (config[segment]) {
                        config = config[segment];
                    } else {
                        return null; 
                    }
                });
            }
            return config;
        }
        else throw "User Object Does not exist";
    };

    /**
     * MongoDB ObjectID
     */
    GLOBAL.objectId = function(id){
        if(!/^[0-9a-fA-F]{24}$/.test(id))
            return null;
        else
            return new ObjectID(id);
    }

    /**
     * check user premisions
     */
    GLOBAL.userCan = function(privilege){
        var privs = GLOBAL.UserObject.privliges;
        var can = false;
        if (privs.indexOf(privilege) > -1) can = true;
        return can;
    };

    GLOBAL.objectIdWithTimestamp = function(timestamp) {
        if (typeof(timestamp) == 'string') {
            timestamp = new Date(timestamp);
        }
        // Convert date object to hex seconds since Unix epoch
        var hexSeconds = Math.floor(timestamp/1000).toString(16);
        // Create an ObjectId with that hex timestamp
        var constructedObjectId = ObjectID(hexSeconds + "0000000000000000");
        return constructedObjectId;
    }
}
module.exports = new helper;
