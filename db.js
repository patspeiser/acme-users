var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/acme_users', {logging: false});

var Departments = db.define('departments', {
	name: { 
		type: Sequelize.TEXT
	},
	isDefault: {
		type: Sequelize.BOOLEAN,
	}
}, {
	hooks: {
	},
	getterMethods: {
	},
	setterMethods: {
	},
	classMethods: {
		getDefault: function(name){
			return Departments.findOne({ where: { isDefault: true } })
		}
	},
	instanceMethods:{
	}
})


var Users = db.define('users', {
	name: { 
		type: Sequelize.TEXT, 
		allowNull: false
	},
}, {
	hooks: {
	},
	getterMethods: {
	},
	setterMethods:{
	},
	classMethods: {
	},
	instanceMethods:{
	}
}) 

Users.belongsTo(Departments);
Departments.hasMany(Users);

module.exports = {
	Departments: Departments,
	Users: Users
}
