const router = require('express').Router();
const chat = require('../controller/chatController');
const verifyToken = require('../lib/verifyToken');

router.get('/allStudent', verifyToken, chat.getAllStudent);
router.post('/sendMessege', verifyToken, chat.sendMessege);
router.get('/messages', verifyToken, chat.getAllMessage);
router.post('/accessChat', verifyToken, chat.accessChat);
router.post('/createGroupChat', verifyToken, chat.createGroupChat);
router.put('/update', verifyToken, chat.updateGroup);
router.post('/addGroupChatUser', verifyToken, chat.addGroupChatUser);
router.delete('/removeGroupChatUser', verifyToken, chat.removeGroupChatUser);
router.get('/groupChatUser', chat.getGroupChatUser);
router.get('/fetchChatByUserId', verifyToken, chat.fetchChatByUserId);
router.get('/getChatById', verifyToken, chat.getChatById);
router
    .route('/notification')
    .post(verifyToken, chat.postNotification)
    .get(chat.getNotification)
    .delete(chat.deleteNotification)
router.delete('/deleteGroup', verifyToken, chat.deleteGroup);

module.exports = router;