const router = require('express').Router();
const chat = require('../controller/chatController');
const verifyToken = require('../lib/verifyToken');

router.get('/allStudent', verifyToken, chat.getAllStudent);
router.post('/sendMessege', verifyToken, chat.sendMessege);
router.get('/messages', verifyToken, chat.getAllMessage);

module.exports = router;