'use strict';

module.exports = function(req, res, next){
    var page = 0;
    if ( !isNaN( Number(req.query.page) ) ) page = req.query.page;
    GLOBAL.CurrentPage = page;
    next();
}
