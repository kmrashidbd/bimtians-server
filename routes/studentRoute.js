const router = require('express').Router();
const studentController = require('../controller/studentController');

router.get('/all', studentController.getAllStudent);


module.exports = router;