var router = require('express').Router();
var dataModels = require('../db');
var Departments = dataModels.Departments;
var Users = dataModels.Users;

module.exports = router;

router.get('/:departmentId', function(req, res, next){
	Departments.findOne({ 
			where: { 
				id: req.params.departmentId 
			},
			include: [{ model: Users }]
		})
		.then(function(departmentData){
			Departments.getDefault()
			.then(function(defaultDepartment){
				res.render('departments', { departmentData: departmentData, defaultDepartment: defaultDepartment })
			})
		})
		.catch(next);
});

router.post('/', function(req, res, next){
	Departments.getDefault()
	.then(function(defaultDepartment){
		if (!defaultDepartment){
			Departments.findOrCreate({ where: { name: req.body.departmentName, isDefault: true } })
			.then(function(department){
				res.redirect('/departments/' + department[0].id);
			})
		} else {
			Departments.findOrCreate({ where: { name: req.body.departmentName, isDefault: false } })
			.then(function(department){
				res.redirect('/departments/' + department[0].id);
			})
		}
	})
	.catch(next)
});

router.post('/:departmentId/employees', function(req, res, next){
	Users.findOrCreate({ where: { name: req.body.employeeName, departmentId: req.params.departmentId } })
	.then(function(user){
		console.log(user)
		res.redirect('/departments/' + user[0].departmentId);
	})
})
