const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const Message = require("./models/message");
const User = require("./models/user");
const Room = require("./models/room");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routers/auth-routes"));
app.use("/api/rooms", require("./routers/roomRoutes"));
app.use("/api/messages", require("./routers/messagesRoutes"));


const server = http.createServer(app);


const io = socketIO(server, {
  cors: {
    origin: "https://plaudern-frontend.vercel.app",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { content, senderId, roomId } = data;

    try {
      const message = await Message.create({
        content,
        sender: senderId,
        room: roomId
      });

      await message.populate("sender", "name email");
      await message.populate("room");

      // 🔁 Broadcast the message to all users in the room
      io.to(roomId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
