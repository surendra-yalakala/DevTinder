const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.on("joinChat", () => {
      console.log("Client joined chat: ", socket.id);
    });

    socket.on("sendMessage", (data) => {
      console.log("Message received: ", data);
      // Broadcast the message to all connected clients
      io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
};

module.exports = initializeSocket;
