const express = require('express');
const router = express.Router();
const AllRoutesController = require('../controller/allRoutesController');

router.get('/getClasses', AllRoutesController.GetAllClass);

router.get('/getTeachers', AllRoutesController.GetAllTeachers);

router.post('/addClass', AllRoutesController.AddClass);

router.post('/addTeacher', AllRoutesController.AddTeacher);

router.post('/addStudent', AllRoutesController.AddStudent);

module.exports = router;