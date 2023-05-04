const router = require('express').Router();
const externalController = require('../controller/externalController');
const verifyToken = require('../lib/verifyToken');

//for add and update employemnt
router.post('/employment/add', verifyToken, externalController.addEmployment);
router.put('/employment/edit/:id', verifyToken, externalController.editEmployment);
router.delete('/employment/delete/:id', verifyToken, externalController.deleteEmployment);
//for add and update others
router.post('/others/add', verifyToken, externalController.addOthers);
router.put('/others/edit', verifyToken, externalController.editOthers);
router.delete('/others/delete/:id', verifyToken, externalController.deleteOthers);

//for academic
router.post('/academic/add', verifyToken, externalController.addAcademic);
router.put('/academic/edit/:id', verifyToken, externalController.editAcademic);
router.delete('/academic/delete/:id', verifyToken, externalController.deleteAcademic);


module.exports = router;