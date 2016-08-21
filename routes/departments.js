var router = require('express').Router();
var dataModels = require('../db');
var Departments = dataModels.Departments;
var Users = dataModels.Users;

module.exports = router;

// display the department with that :departmentId, incude employees in that directory
router.get('/:departmentId', function(req, res, next){
	Departments.findAll({
			incude: [{model: Users }] 
		})
		.then(function(departmentData){
			Departments.getDefault()
			.then(function(defaultDepartment){
				res.render('departments', { 
					departmentData: departmentData, 
					defaultDepartment: defaultDepartment, 
					thisDepartment: req.params.departmentId })
			})
		})
		.catch(next);
});

//when departments are created check if default. if not set that one as default. redirect back to departments:/:departmentId either way
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

//add employees to department
router.post('/:departmentId/employees', function(req, res, next){
	Users.findOrCreate({ where: { name: req.body.employeeName, departmentId: req.params.departmentId } })
	.then(function(user){
		res.redirect('/departments/' + user[0].departmentId);
	})
});

//delete employee from department
router.delete('/:departmentId/employees/:employeeId', function(req, res, next){
	Users.destroy({
		where: {
			id: req.params.employeeId
		}	
	})
	.then( function(){
		res.redirect('back');
	})
})

//make existing department the default department
router.put('/:departmentId', function(req, res, next){
	Departments.findOne({ where: { isDefault: true } })
	.then(function(defaultDepartment){
		Departments.update({
			isDefault: false
		},{
			where: { 
				isDefault: true 
			}
		})
	})
	.then(function(){
		Departments.update({
			isDefault: true
			}, {
				where: {
					id: req.params.departmentId
				}	
			})
	}).then( function(){
		res.redirect('/departments/' + req.params.departmentId);
	})
})
