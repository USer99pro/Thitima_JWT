const jwt = require('jsonwebtoken');

// Middleware ตรวจสอบ JWT
const verifyToken = (req, res, next) => {
  // ดึง token จาก headers
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // ตรวจสอบ token ว่าถูกต้องหรือไม่
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    // เก็บข้อมูล user ที่ถูกถอดรหัสไว้ใน req เพื่อใช้ใน route อื่นได้
    req.userId = decoded.id;
    next();
  });
};
