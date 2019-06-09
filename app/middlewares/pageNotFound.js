let error404 = require('../services/error404');

module.exports = function(req, res, next){
    error404(req, res);
    next();
}