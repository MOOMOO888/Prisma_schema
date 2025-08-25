exports.addComment = async (req, res) => {
  try {
    // แปลงให้แน่ใจว่าเป็นตัวเลข (ถ้า id ใน DB เป็น Int)
    const authorId = Number(req.user.userId);
    const postId = Number(req.params.id);
    const { text } = req.body;

    if (!postId || Number.isNaN(postId)) {
      return res.status(400).json({ error: "invalid post id" });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    // ตรวจว่าโพสต์มีอยู่ (findUniqueOrThrow จะโยน Prisma.PrismaClientKnownRequestError หรือ Prisma.NotFoundError ขึ้นกับเวอร์ชัน)
    await prisma.post.findUniqueOrThrow({ where: { id: postId } });

    // สร้างคอมเมนต์
    const comment = await prisma.comment.create({
      data: { postId, authorId, text: text.trim() },
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
      },
    });

    // ส่ง event แบบ realtime (ถ้ามี io)
    const io = req.app.get("io");
    if (io) {
      io.to(`post:${postId}`).emit("comment:new", comment);
    }

    return res.status(201).json(comment);
  } catch (err) {
    // Prisma อาจโยนข้อผิดพลาดหลายแบบ — ตรวจข้อความ/รหัสข้อผิดพลาด
    // ตัวอย่างการจับเมื่อไม่พบ (ขึ้นกับ Prisma เวอร์ชัน): err.code === 'P2025' หรือ err.name === 'NotFoundError'
    if (err?.code === "P2025" || err?.name === "NotFoundError") {
      return res.status(404).json({ error: "Post not found" });
    }
    console.error("addComment error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
