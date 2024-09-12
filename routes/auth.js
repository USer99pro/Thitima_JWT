const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // ตรวจสอบว่า username, email, และ password ถูกส่งเข้ามาหรือไม่
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // ตรวจสอบว่า password มีค่าและส่งเข้าไปยัง bcrypt อย่างถูกต้อง
    const hashedPassword = await bcrypt.hash(password, 10); // ปัญหาอาจเกิดจาก password = undefined
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "Register Sussecc" });
  } catch (error) {
    console.error("Error during user registration:", error.message); // แสดงข้อผิดพลาดใน console
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบว่า username และ password ถูกส่งมาหรือไม่
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่ตรงกับ username หรือไม่
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ตรวจสอบความถูกต้องของ password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // สร้าง JWT token
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error.message); // แสดงข้อผิดพลาดใน console
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

router.get("/getdataalluser", async (req, res) => {
  try {
    const users = await User.find({}, "username email"); // ข้อมูลที่ดึงออกมา
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

module.exports = router;
