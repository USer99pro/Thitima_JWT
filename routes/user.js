const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const hello = require('../Middleware/hello');


// Middleware สำหรับตรวจสอบ JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Get all users
router.get('/getdataalluser', async (req, res) => {
  try {
    const users = await User.find({}, 'username email'); // ข้อมูลที่ดึงออกมา
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// สร้าง route hello world โดยใช้ middleware verifyToken เพื่อตรวจสอบ JWT
router.get('/hello', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

module.exports = router;

