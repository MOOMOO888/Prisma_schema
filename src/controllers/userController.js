const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const JWT_SECRET = "mysecretkey"; // ควรเก็บใน .env จริงๆ

// Register (ไม่อัปโหลดรูปตอนสมัคร)
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login success", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit Profile + Upload Profile Image
// Edit Profile + Upload Profile Image + Update Email + Update Password
exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, password } = req.body;
    let profileImage;

    if (req.file) {
      profileImage = req.file.filename; // หรือ path: `uploads/${req.file.filename}`
    }

    // ตรวจสอบ email ซ้ำ ถ้ามีการส่ง email ใหม่
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // ถ้ามีการส่ง password ใหม่ ให้ hash ก่อน
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(profileImage && { profileImage })
      }
    });

    res.json({
      message: "Profile updated",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ดึงข้อมูล user ทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,   // เพิ่มตรงนี้
        profileImage: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,   // เพิ่มตรงนี้
        profileImage: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};