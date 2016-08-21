var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var departmentsRoute = require('./routes/departments.js');
var dataModels = require('./db.js');
var Departments = dataModels.Departments;

module.exports = app;


swig.setDefaults({ cached: false });
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/node_modules/'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res, next){
	Departments.getDefault()
	.then( function(defaultDepartment){
		if (defaultDepartment){
			return res.render('index', { defaultDepartment: defaultDepartment})
		}
			return res.render('index')
		})
})

app.use('/departments', departmentsRoute);
