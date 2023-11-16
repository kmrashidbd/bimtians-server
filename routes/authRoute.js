const router = require('express').Router();
const authController = require('../controller/authController');
const verifyAdmin = require('../lib/verifyAdmin');
const verifyToken = require('../lib/verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/sendMessage', authController.sendMessage);
router.get('/loggedIn', verifyToken, authController.loggedInStudent);
router.get('/adminPanel', authController.adminPanel);
router.put('/changePassword', verifyToken, authController.changePassword);
router.post('/forgotPassword/:email', authController.forgotPassword);
router.put('/resetPassword/:id', authController.resetPassword);
router.route('/:id')
    .put(verifyToken, verifyAdmin, authController.updateById)
    .delete(verifyToken, verifyAdmin, authController.deleteById)

module.exports = router;