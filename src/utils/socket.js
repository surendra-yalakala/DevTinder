const socket = require("socket.io");
const crypto = require("crypto");

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
