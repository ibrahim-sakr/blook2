'use strict';

var app = customUse('App');

// reviews
// "assign_to": ["name", "_id"]

/**
 * the Main Model to enteract with database
 * DO NOT use it directly ... instead inherit it in child models.
 */
function Model() {
    this.updated_at = true;
    this.deleted_at = true;

    /**
     * [all description]
     * @param  {Function} callback     [description]
     * @param  {[type]}   itemsPerPage [description]
     * @return {[type]}                [description]
     */
    this.all = function(filter, callback, itemsPerPage, sort){
        var filter = (filter != '') ? filter : {};
        var itemsPerPage = itemsPerPage || 0;
        var pageNum = GLOBAL.CurrentPage > 0 ? ( ( GLOBAL.CurrentPage - 1 ) * itemsPerPage ) : 0;
        var sort = sort || -1;
        app.get('db').collection(this.collection).find({
            deleted_at: { $exists: false }
        }, filter, {
            skip: pageNum,
            limit: Number(itemsPerPage)
        }).sort({_id: sort}).toArray(function(err, docs) {
            if (err) throw err;
            return callback(docs);
        });
    };

    /**
     * [find description]
     * @param  {[type]}   obj      [{ _id: "", filter: {} }, objectId("id")]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.find = function(obj, callback){
        var filter = (obj.filter) ? obj.filter : {};
        var _id = (obj._id) ? obj._id : obj;
        app.get('db').collection(this.collection).findOne({_id: _id}, filter, function(err, doc){
            if (err) throw err
            return callback(doc);
        });
    };

    /**
     * [where description]
     * @param  {Object}   obj          [Matching query or embeded where and filter query]
     * @param  {Function} callback     [return data]
     * @param  {Number}   itemsPerPage [number of requested results]
     * @param  {Number}   sort         [Descending -1 or Ascending 1]
     * @return {Function}              [Callback functon]
     */
    /**
     * Model.where({where : {"matching query"} , filter :{ filtered return values}},function(results), number, -1)
     * Model.where({"matching query"},function(results), number, -1)
     */
    this.where = function(obj, callback, itemsPerPage, sort){
        var filter = (obj.filter) ? obj.filter : {}; 
        var obj = (obj.where) ? obj.where : obj;
        var itemsPerPage = itemsPerPage || 0;
        var pageNum = GLOBAL.CurrentPage > 0 ? ( ( GLOBAL.CurrentPage - 1 ) * itemsPerPage ) : 0;

        if (typeof sort != 'object') {
            if (sort && typeof sort == 'number') {
                sort = { '_id': sort };
            } else {
                sort = { '_id': -1 };
            };
        }

        obj.deleted_at = { $exists: false };
        app.get('db').collection(this.collection).find(obj, filter,{
            skip: pageNum,
            limit: Number(itemsPerPage)
        }).sort(sort).toArray(function(err, docs){
            if (err) throw err;
            if (typeof callback == 'function') {
                return callback(docs);
            }
        });
    };

    /**
     * [whereSortFiltred description]
     * @param  {Object}   obj          [Matching query or embeded where and filter query]
     * @param  {Object}   sortBy       [Sorting element and sorting delimeter]
     * @param  {Function} callback     [Callback]
     * @param  {Number}   itemsPerPage [Number of elements to be returned]
     * @return {Function}              [Callback contains queried data]
     */

    /**
     * Model.where({where : {"query"}, filter : {"filtered return values"}}, {"sort delimeter" : 1}, function(results), 20)
     * Model.where({"query"}, {"sort delimeter" : 1}, function(results), 20)
     */
    this.whereSortFiltred = function(obj, sortBy, callback, itemsPerPage){
        var filter = (obj.filter) ? obj.filter : {}; 
        var obj = (obj.where) ? obj.where : obj;
        var itemsPerPage = itemsPerPage || 0;
        var pageNum = GLOBAL.CurrentPage > 0 ? ( ( GLOBAL.CurrentPage - 1 ) * itemsPerPage ) : 0;
        var sortBy = sortBy || {};
        obj.deleted_at = { $exists: false };
        app.get('db').collection(this.collection).find(obj, filter,{
            skip: pageNum,
            limit: Number(itemsPerPage)
        }).sort(sortBy).toArray(function(err, docs){
            if (err) throw err;
            if (typeof callback == 'function') {
                return callback(docs);
            }
        });
    }
    
    /**
     * [whereWithDeleted description]
     * @param  {[type]}   obj          [description]
     * @param  {Function} callback     [description]
     * @param  {[type]}   itemsPerPage [description]
     * @return {[type]}                [description]
     */
    this.whereWithDeleted = function(obj, callback, itemsPerPage, sort){
        var itemsPerPage = itemsPerPage || 0;
        var pageNum = GLOBAL.CurrentPage > 0 ? ( ( GLOBAL.CurrentPage - 1 ) * itemsPerPage ) : 0;
        var sort = sort || -1;
        app.get('db').collection(this.collection).find(obj, {
            skip: pageNum,
            limit: Number(itemsPerPage)
        }).sort({_id: sort}).toArray(function(err, docs){
            if (err) throw err;
            return callback(docs);
        });
    };

    /**
     * [update description]
     * @param  {[type]}   where    [description]
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.update = function(where, obj, callback){
        app.get('db').collection(this.collection).updateMany(where, {$set: obj}, function(err, doc){
            if (err) throw err;
            if (typeof callback == "function") {
                return callback(doc);
            }
        })
    };

    /**
     * [updateOneByReplace description]
     * @param  {[type]}   id       [description]
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.updateOneByReplace = function(id, obj, callback){
        app.get('db').collection(this.collection).updateOne({_id: id}, obj, {upsert:false}, function(err, doc){
            if (err) throw err;
            return callback(doc);
        })
    };

    /**
     * [create description]
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.create = function(obj, callback){
        if (typeof obj === "object" && !Array.isArray(obj)) {
            // insertOne
            app.get('db').collection(this.collection).insertOne(obj, function(err, doc){
                if(typeof callback == 'function')
                    return callback(doc);
            });
        }
        if (Array.isArray(obj)) {
            // insertMany
            app.get('db').collection(this.collection).insertMany(obj, function(err, doc){
                if(typeof callback == 'function')
                    return callback(doc);
            });
        }
    };

    /**
     * [delete description]
     * @param  {string, object} id       [string with ID or obj]
     * @param  {Function}       callback []
     * @return {function}                [callback function]
     */
    this.delete = function(id, callback){
        var obj;
        var success = function(err, doc){
            if (err) throw err;
            return callback(doc);
        };
        if (Array.isArray(id)) {
            obj = { _id: { $in: id } };
            app.get('db').collection(this.collection).updateMany(obj, {$set: { deleted_at: new Date() }}, success);
        } else {
            obj = {_id: id};
            app.get('db').collection(this.collection).updateOne(obj, {$set: { deleted_at: new Date() }}, success);
        };
    };

    /**
     * [deleteWhere description]
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.deleteWhere = function(obj, callback){
        app.get('db').collection(this.collection).updateMany(obj, {$set: { deleted_at: new Date() }}, function(err, doc){
            if (err) throw err;
            return callback(doc);
        });
    };

    /**
     * [hardDelete description]
     * @param  {[type]}   id       [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.hardDelete = function(id, callback){
        var obj;
        if (id.toString().length == 24) {
            obj = {_id: id};
        } else {
            obj = id;
        }
        app.get('db').collection(this.collection).remove(obj, function(err, data){
            if (err) throw err;
            return callback(data);
        });
    };

    /**
     * [with description]
     * @param  {[type]}   models       [description]
     * @param  {Function} callback     [description]
     * @param  {[type]}   itemsPerPage [description]
     * @return {[type]}                [description]
     */
    this.with = function(models, callback, itemsPerPage, obj, sort){
        var sort = sort || -1,
            models = models || [],
            functionName;
        if (typeof obj === "undefined") {
            obj = {}; functionName = 'where';
        } else {
            if (typeof obj === "object") { functionName = 'where'; };
            if (typeof obj === "string") { obj = GLOBAL.objectId(obj); functionName = 'find'; };
        };
        if (typeof models === "string") models = [{ model: models, key: models.toLowerCase() + "_id" }];
        else if ( typeof models === 'object' && !Array.isArray(models) ) models = [models];
        else if ( Array.isArray(models) ){
            for (var i = 0; i < models.length; i++) {
               if (typeof models[i] === "string") {
                    models[i] = { model: models[i], key: models[i].toLowerCase() + "_id" };
                }
            }
        }

        var count  = models.length,
            done   = 0;

        this[functionName](obj, function(source){
            if(typeof source === "object" && !Array.isArray(source)) source = [source];
            models.forEach(function(element){
                var Model = useModel(element.model);
                var model_ids = [];

                for (var a = 0; a < source.length; a++) {
                    var key = source[a][element.key];
                    if (typeof key === "object" && !Array.isArray(key)) {
                        model_ids.push( GLOBAL.objectId( key ) );
                    };
                    if (Array.isArray(key)) {
                        for (var w = 0; w < key.length; w++) {
                            model_ids.push( GLOBAL.objectId( key[w] ) );
                        }
                    };
                };

                var object = { _id: { $in: model_ids } };
                Model.where(object, function(submodel){
                    for (var z = 0; z < source.length; z++) {
                        var ele = element.key.split("_")[0];
                        var customKey = source[z][element.key];
                        if (ele == customKey) {
                            ele = ele + "_object";
                        };

                        source[z][ele] = [];

                        var field = [];

                        if ( typeof customKey === "object" ) field = [customKey.toString()];

                        if ( Array.isArray(customKey) ) {
                            for (var w = 0; w < customKey.length; w++) {
                                field.push( customKey[w].toString() );
                            }
                        }
                        for (var x = 0; x < submodel.length; x++) {
                            // if (typeof field === "string" && field == submodel[x]._id) {
                            //     source[z][ele] = submodel[x];
                            // };

                            if (Array.isArray(field)) {
                                if (field.indexOf( submodel[x]._id.toString() ) !== -1) {
                                    source[z][ele].push(submodel[x]);
                                }
                            }
                        }
                    }
                    done++;
                    if (count === done) return  callback(source);
                });
            });
        }, itemsPerPage, sort);
    };

    /**
     * [whereWith description]
     * @param  {[type]}   obj          [description]
     * @param  {[type]}   models       [description]
     * @param  {Function} callback     [description]
     * @param  {[type]}   itemsPerPage [description]
     * @param  {[type]}   sort         [description]
     * @return {[type]}                [description]
     */
    this.whereWith = function( obj, models, callback, itemsPerPage, sort ){
        this.with(models, function(data){
            return callback(data);
        }, itemsPerPage, obj, sort);
    };

    /**
     * [findWith description]
     * @param  {[type]}   id       [description]
     * @param  {[type]}   models   [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   sort     [description]
     * @return {[type]}            [description]
     */
    this.findWith = function( id, models, callback, sort ){
        this.with(models, function(data){
            return callback(data);
        }, 0, id.toString(), sort);
    };

    /**
     * [count description]
     * @param  {[type]}   where    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.count = function(where, callback){
        app.get('db').collection(this.collection).count(where, function(err, count){
            if (err) throw err;
            return callback(count);
        });
    };
}

module.exports = Model;
