const router = require('express').Router();
const studentController = require('../controller/studentController');
const verifyToken = require('../lib/verifyToken');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, './assets/images')
    },
    filename: (req, file, cb)=>{
      const fileExt = path.extname(file.originalname);
      const fileName = file.originalname
                            .replace(fileExt, "")
                            .toLowerCase()
                            .split(" ")
                            .join("-")+"-"+req.user.id
      cb(null, fileName+fileExt);
    }
  });

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb)=>{
        if(
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        ){
            cb(null, true)
        }else{
            cb(new Error(" jpg, jpeg, png format allowed only!"))
        }
    }
});

router.get('/all', studentController.getAllStudent);
router.post('/search', studentController.getStudentsByName);
router.get('/employment/:name', studentController.getStudentByEmployment);
router.post('/addPersonal', verifyToken, studentController.addStudentPersonalDetails);
router.put('/editPersonal', verifyToken, studentController.updateStudentDetails);
router.put('/editBasic', verifyToken, studentController.updateBasic);
router.put('/editPhoto', verifyToken, upload.single('photo'), studentController.editPhoto);
router.route('/:id')
.get(studentController.getStudentById)


module.exports = router;