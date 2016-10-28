var fs = require('fs');

/**
 * Config Class Utility
 * @return {string} value of requested key
 */
function Config(){
    this.get = function(key, defaultVal){
        // set defaults
        var defaultVal = defaultVal || null;

        // check current env
        var env = this.env();
        // load Config file into var
        var data = require('../Config/' + env);

        // segments
        var segments = key.split(".");

        // start looping
        for (var i = 0; i < segments.length; i++) {
            if ( typeof data[segments[i]] !== "undefined" ) {
                data = data[segments[i]];
            } else {
                data = defaultVal;
                break;
            }
        }

        // get value from it
        return data;
    };

    this.env = function(){
        return process.env.Env;
    };
};
module.exports = new Config;
