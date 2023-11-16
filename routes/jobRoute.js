const router = require('express').Router();
const jobController = require('../controller/jobController');
const upload = require('../lib/multerData');
const verifyToken = require('../lib/verifyToken');
const verifyAdmin = require('../lib/verifyAdmin');

router.post('/create', verifyToken, upload.single('photo'), jobController.postJob);
router.get('/all', verifyToken, verifyAdmin, jobController.getAllJob);
router.get('/published', jobController.getAllPublishedJob);
router.get('/jobByUser', verifyToken, jobController.getJobByUser);
router.route('/:id')
    .get(jobController.getJobById)
    .put(verifyToken, jobController.updateJob)
    .delete(verifyToken, jobController.deleteJob)


module.exports = router;