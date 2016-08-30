var router = require('express').Router();
var dataModels = require('../db');
var Promise = require('bluebird');
var Departments = dataModels.Departments;
var Users = dataModels.Users;

module.exports = router;

// display the department with that :departmentId, incude employees in that directory
router.get('/:id', function(req, res, next){
  //do you need to find ALL departments with ALL Employees.. can't you just get the department with the passed in id, and include it's employees?
  Promise.all([
    Departments.findAll({
        include: [{model: Users}] 
    }),
    Departments.getDefault()
  ])
  .spread(function(departments, defaultDepartment){
      res.render('departments', { 
        departmentData: departments, 
        defaultDepartment: defaultDepartment, 
        thisDepartment: req.params.id });
  })
  .catch(next);
});

//when departments are created check if default. if not set that one as default. redirect back to departments:/:departmentId either way
router.post('/', function(req, res, next){
  Departments.create({
    name: req.body.name
  })
  .then(function(department){
    res.redirect('/departments/' + department.id);
  })
	.catch(next);
});

//add employees to department
router.post('/:id/employees', function(req, res, next){
	Users.create({ name: req.body.employeeName, departmentId: req.params.id })
	.then(function(user){
		res.redirect('/departments/' + user.departmentId);
	});
});

//delete employee from department
router.delete('/:departmentId/employees/:id', function(req, res, next){
	Users.destroy({
		where: {
			id: req.params.id
		}	
	})
	.then( function(){
		res.redirect('/departments/' + req.params.departmentId);
	});
});

//make existing department the default department
router.put('/:id', function(req, res, next){
  Departments.getDefault()
    .then(function(department){
      department.isDefault = false;
      return department.save();
    })
    .then(function(){
      return Departments.findById(req.params.id);
    })
    .then(function(department){
      department.isDefault = true;
      return department.save();
    })
	  .then( function(department){
		  res.redirect('/departments/' + req.params.id);
	  })
    .catch(next);
});
