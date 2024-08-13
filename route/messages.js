const express = require('express');
const {addMessage, getAllMessages, getMessageByUserId, deleteMessage} = require('../controller/message');
const middlewares = require('../middleware');
const router = express.Router();

// router.route("/add/message").post(middlewares.verifyToken, /*middlewares.verifyAccess, */ addMessage);
router.route("/messages").get(getAllMessages);
router.route("/messages/:userId").get(getMessageByUserId);
router.route("/delete/message/:id").delete(deleteMessage);

module.exports = router;