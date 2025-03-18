const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT for authentication
const db = require("../db");
const { createUserTable } = require("../models/User");

const router = express.Router();

// Ensure the users table exists
createUserTable();

// Register User
router.post("/register", async (req, res) => {
  const { username, password, email, phone } = req.body;

  if (!username || !password || !email || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, hashedPassword, email, phone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Registration failed" });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
});

// ✅ **Login User**
router.post("/login", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Both identifier and password are required" });
  }

  // Check if user exists (by username or email)
  const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or email" });
    }

    const user = results[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token (replace `your_secret_key` with an actual secret)
    const token = jwt.sign({ userId: user.id }, "your_secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  });
});

module.exports = router;
