const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const generateRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ firstName, userId, targetUserId }) => {
      const roomId = generateRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(`${firstName} joined room: ${roomId}`);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = generateRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // Broadcast the message to all connected clients
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {
          console.error("Error sending message: ", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
};

module.exports = initializeSocket;
