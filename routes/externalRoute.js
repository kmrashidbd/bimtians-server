const router = require('express').Router();
const externalController = require('../controller/externalController');
const verifyToken = require('../lib/verifyToken');
const verifyAdmin = require('../lib/verifyAdmin');

//for add and update employemnt
router.post('/employment/add', verifyToken, externalController.addEmployment);
router.put('/employment/edit/:id', verifyToken, externalController.editEmployment);
router.delete('/employment/delete/:id', verifyToken, externalController.deleteEmployment);
//for add and update others
router.post('/others/add', verifyToken, externalController.addOthers);
router.put('/others/edit', verifyToken, externalController.editOthers);

router.get('/contactRequest', verifyToken, externalController.getSingleUserContactRequest);
router.get('/contactRequest/all', verifyToken, verifyAdmin, externalController.getAllContactRequest);
router.post('/contactRequest/:id', verifyToken, externalController.createContactRequest)
router.put('/contactRequest/edit/:id', verifyToken, externalController.editContactRequest);

module.exports = router;