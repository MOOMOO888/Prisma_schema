const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(express.json());

// ให้เข้าถึงไฟล์อัพโหลดได้
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
app.get("/", (req, res) => res.json({ message: "API Running" }));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// สร้าง HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ปรับ origin ให้ตรงกับ frontend จริงๆ
  },
});

// เก็บ io object ไว้ใช้ใน controller (เช่น emit realtime)
app.set("io", io);

// socket handler
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // เข้าห้องโพสต์
  socket.on("post:join", ({ postId }) => {
    socket.join(`post:${postId}`);
    console.log(`📥 join post:${postId}`);
  });

  socket.on("post:leave", ({ postId }) => {
    socket.leave(`post:${postId}`);
    console.log(`📤 leave post:${postId}`);
  });

  // chat ตัวอย่าง
  socket.on("chat:send", (data) => {
    console.log("💬 chat:", data);
    io.to(`post:${data.postId}`).emit("chat:new", {
      userId: socket.id,
      message: data.message,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`)
);
