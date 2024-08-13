const mongoose = require("mongoose");

const discussionSchema = mongoose.Schema({
  participants: [
    {
      user1_id: {type: String, required: true, unique: true},
      user2_id: {type: String, required: true, unique: true}
    }
  ],
  conversation: [
    {
      messageId: mongoose.Schema.Types.ObjectId,  
      messageUserId: {type: String, required: true, unique: true},
      content: {type: String, required: true}
    }
  ]
});

module.exports = mongoose.model('Discussion', discussionSchema);

// {
//     _id: ObjectId("discussion_id"),
//     participants: [],
//     messages: [
//       { content: "Message 1", author: user1_id, timestamp: Date },
//       { content: "Message 2", author: user2_id, timestamp: Date },
//       ...
//     ],
//     createdAt: Date,
//     lastMessage: { content: "Message 2", author: user2_id, timestamp: Date }
//     // Autres champs
//   }
  