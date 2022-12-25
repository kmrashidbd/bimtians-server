const router = require('express').Router();
const studentController = require('../controller/studentController');
const verifyToken = require('../lib/verifyToken');

router.get('/all', studentController.getAllStudent);
router.post('/addPersonal', verifyToken, studentController.addStudentPersonalDetails);
router.post('/addEmployment', verifyToken, studentController.addStudentEmploymentDetails);
router.post('/addAcademic', verifyToken, studentController.addStudentAcademicDetails);
router.post('/addOthers', verifyToken, studentController.addStudentOthersDetails);
router.route('/:id')
.get(studentController.getStudentById)


module.exports = router;