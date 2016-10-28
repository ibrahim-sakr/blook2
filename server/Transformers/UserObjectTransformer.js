'use strict';
// var Transformer = useTransformer('Transformer');
/**
 * [UserStatisticsTransformer description]
 */
var UserObjectTransformer = function(){

    /**
     * [transform description]
     * @param  {[type]} input [description]
     * @return {[type]}       [description]
     */
    this.transformPrivilegesToArray = function(input){
        // FROM
        // {
        //     _id: ObjectID {
        //         _bsontype: 'ObjectID',
        //         id: [Object]
        //     },
        //     name: 'access_messages',
        //     display_name: 'Access Messages'
        // }
        // TO
        // ['name', 'name']
        return input.map(function(element){
            return element.name;
        });
    };
};

// UserObjectTransformer.prototype = new Transformer
module.exports = new UserObjectTransformer;
