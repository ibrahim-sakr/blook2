/**
 * Node Cache
 *
 * to save JWT tokens in cahe so the user stil signed in
 *
 * @Cache => create one global object for caching
 */
var nodeCache = require('node-cache');
var Cache = module.exports = new nodeCache();
