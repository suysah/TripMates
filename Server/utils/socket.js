const socketIo = require("socket.io");

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [
        "https://trip-mates-yik2.vercel.app",
        "https://trip-mates-yik2-git-main-suysahs-projects.vercel.app",
        "http://localhost:5173",
        "https://trip-mates-yik2-devdrz2t2-suysahs-projects.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("New client connected to socket:", socket.id);

    // User joins a specific tour chat room
    socket.on("join_tour", ({ tourId, userName }) => {
      socket.join(tourId);
      // console.log(`User ${userName} (${socket.id}) joined tour room: ${tourId}`);
      
      // Notify other room occupants
      socket.to(tourId).emit("message", {
        senderName: "System 🤖",
        senderPhoto: "default.jpg",
        message: `${userName} has joined the chat!`,
        createdAt: new Date().toISOString(),
        system: true,
      });
    });

    // Handle sending a message in a tour room
    socket.on("send_message", ({ tourId, message, senderName, senderPhoto }) => {
      // Broadcast the message back to all clients in the room
      io.to(tourId).emit("message", {
        senderName,
        senderPhoto,
        message,
        createdAt: new Date().toISOString(),
        system: false,
      });
    });

    socket.on("disconnect", () => {
      // console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
