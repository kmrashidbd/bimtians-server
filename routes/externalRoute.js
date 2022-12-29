const router = require('express').Router();
const externalController = require('../controller/externalController');
const verifyToken = require('../lib/verifyToken');

//for add and update employemnt
router.post('/employment/add', verifyToken, externalController.addEmployment)
router.put('/employment/edit', verifyToken, externalController.editEmployment)
//for add and update academic
router.post('/academic/add', verifyToken, externalController.addAcademic)
router.put('/academic/edit', verifyToken, externalController.editAcademic)
//for add and update others
router.post('/others/add', verifyToken, externalController.addOthers)
router.put('/others/edit', verifyToken, externalController.editOthers)

module.exports = router;