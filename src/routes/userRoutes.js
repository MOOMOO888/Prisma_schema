const express = require('express');
const multer = require('multer');
const { register, login, editProfile, getAllUsers, getUserById } = require('../controllers/userController');

const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// routes
router.post('/register', register);
router.post('/login', login);

// **เฉพาะ admin**
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);

// edit profile สำหรับ user ปกติ
router.put('/edit-profile', authMiddleware, upload.single('profileImage'), editProfile);

module.exports = router;
