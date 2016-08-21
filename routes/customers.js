var router = requires('express').Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

module.exports = router;

router.get('/', function(req, res, next){
	res.render('index', {});
})
