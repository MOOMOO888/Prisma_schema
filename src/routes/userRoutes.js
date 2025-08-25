const express = require('express');
const multer = require('multer');
const { register, login, editProfile, getAllUsers,getUserById } = require('../controllers/userController');
const auth = require('../middleware/auth');

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

router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/edit-profile', auth, upload.single('profileImage'), editProfile);

module.exports = router;
