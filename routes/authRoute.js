const router = require('express').Router();
const authController = require('../controller/authController');
const verifyAdmin = require('../lib/verifyAdmin');
const verifyToken = require('../lib/verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/loggedIn', verifyToken, authController.loggedInStudent);
router.post('/forgotPassword/:email', authController.forgotPassword);
router.put('/:id', verifyToken, verifyAdmin, authController.updateById)

module.exports = router;