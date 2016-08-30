var Sequelize = require('sequelize');
//don't hardcode connection string - use ENV variables
var db = new Sequelize('postgres://localhost:5432/acme_users', {logging: false});

var Departments = db.define('departments', {
	name: { 
		type: Sequelize.TEXT
	},
	isDefault: {
		type: Sequelize.BOOLEAN,
    defaultValue: false
	}
}, {
	classMethods: {
		getDefault: function(name){
			return Departments.findOne({ where: { isDefault: true } })
        .then(function(department){
          if(department)
            return department;
          return Departments.create({
            name: 'Accounting',
            isDefault: true
          });
        });
		}
	},
	instanceMethods:{
	}
});

//models should be singular
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
};
