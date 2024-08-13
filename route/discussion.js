const express = require('express');
const {searchUserByEmail, addMessageToDiscussion, getDiscussions} = require('../controller/discussion');
const middlewares = require('../middleware');
const router = express.Router();

//la route searchUserByEmail va créer la discussion en faisant appel a createDiscussion
router.route("/user/:email").get(searchUserByEmail);
router.route("/discussions").get(middlewares.verifyToken, /*middlewares.verifyAccess, */ getDiscussions);
router.route("/add/message").post(middlewares.verifyToken, addMessageToDiscussion);



module.exports = router;