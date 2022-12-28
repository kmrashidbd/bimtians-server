const router = require('express').Router();
const studentController = require('../controller/studentController');
const verifyToken = require('../lib/verifyToken');

router.get('/all', studentController.getAllStudent);
router.post('/addPersonal', verifyToken, studentController.addStudentPersonalDetails);
router.put('/editPersonal', verifyToken, studentController.updateStudentDetails);
router.route('/:id')
.get(studentController.getStudentById)


module.exports = router;