const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    messageUserId: {type: String, required: true, unique: true},
    discussionId : {type: String, required: true, unique: true},
    //userEmail : {type: String, required: true, unique: true},
    content: {type: String, required: true},
})
module.exports = mongoose.model('Message', messageSchema)