const router = require('express').Router();
const authController = require('../controller/authController');
const verifyToken = require('../lib/verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/loggedIn', verifyToken, authController.loggedInStudent)
router.route('/:id')
.put(verifyToken, authController.updateById)
.delete(verifyToken, authController.deleteById)

module.exports = router;