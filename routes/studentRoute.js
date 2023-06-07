const router = require('express').Router();
const studentController = require('../controller/studentController');
const upload = require('../lib/multerData');
const verifyToken = require('../lib/verifyToken');

router.get('/all', studentController.getAllStudent);
router.post('/search', studentController.searchStudent);
router.get('/employment/:name', studentController.getStudentByEmployment);
router.post('/addPersonal', verifyToken, studentController.addStudentPersonalDetails);
router.put('/editPersonal', verifyToken, studentController.updateStudentDetails);
router.put('/editBasic', verifyToken, studentController.updateBasic);
router.put('/editPhoto', verifyToken, upload.single('photo'), studentController.editPhoto);
router.route('/:id').get(studentController.getStudentById)


module.exports = router;