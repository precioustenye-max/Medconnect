const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getCurrentUser } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/logout
router.post("/logout", logoutUser);

// GET /api/auth/me
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;
