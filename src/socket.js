io.on("connection", (socket) => {
  // ถ้าต้องการ ตรวจ token แล้ว map socket.userId
  // socket.handshake.auth.token -> validate -> socket.userId = user.id

  // เข้าห้องโพสต์ (ทั้ง chat + comment notify)
  socket.on("post:join", ({ postId }) => socket.join(`post:${postId}`));
  socket.on("post:leave", ({ postId }) => socket.leave(`post:${postId}`));

  // chat message (server ตรวจ user จาก token แล้วบันทึก)
  socket.on("chat:send", async ({ postId, message }) => {
    // validate, persist (prisma.chatMessage.create) -> emit 'chat:new'
    io.to(`post:${postId}`).emit("chat:new", createdMessage);
  });

  // realtime comment send (ถ้าอยากให้ส่งผ่าน socket)
  socket.on("comment:send", async ({ postId, text }) => {
    // persist (prisma.comment.create) -> emit 'comment:new'
    io.to(`post:${postId}`).emit("comment:new", createdComment);
  });

  // typing indicator
  socket.on("chat:typing", ({ postId, isTyping }) => {
    socket
      .to(`post:${postId}`)
      .emit("chat:typing", { userId: socket.userId, isTyping });
  });
});
