const mangoose = require("mongoose");

const messageSchema = new mangoose.Schema({
  senderId: {
    type: mangoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const chatSchema = new mangoose.Schema({
  participants: [
    {
      type: mangoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema],
});

const Chat = mangoose.model("Chat", chatSchema);

module.exports = Chat;
