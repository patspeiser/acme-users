var http = require('http');
var server = http.createServer(require('./app'));
var dataModels = require('./db');
var Departments = dataModels.Departments;
var Users = dataModels.Users;

Departments.sync({force: true})
	.then(function(){
		return Users.sync({force: true})
	})
	.then(function(){
		server.listen(process.env.PORT, function(){
			console.log('Listening on port: ' + process.env.PORT);
		})
	})

