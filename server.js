var http = require('http');
var server = http.createServer(require('./app'));
var dataModels = require('./db');
var Departments = dataModels.Departments;
var Users = dataModels.Users;

//if you had a db object with a sync method, you could just do db.sync.
//also you don't also want to sync.. sync based on environment variable
Departments.sync({force: true})
	.then(function(){
		return Users.sync({force: true})
	})
	.then(function(){
		server.listen(process.env.PORT, function(){
			console.log('Listening on port: ' + process.env.PORT);
		})
	})

