const router = require('express').Router();
const studentController = require('../controller/studentController');

router.get('/all', studentController.getAllStudent);
router.route('/:id')
.get(studentController.getStudentById)


module.exports = router;