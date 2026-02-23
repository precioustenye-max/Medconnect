const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Pharmacy, User } = require("../models");

const issueAuthCookie = (res, user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, pharmacyLocation, pharmacyName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (role && role === "pharmacy") {
      // ensure all pharmacy fields are available
      if (!pharmacyName || !pharmacyLocation || !phone) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }
      // create the pharmacy 
      const pharmacy = await Pharmacy.create({
        name: pharmacyName,
        location: pharmacyLocation,
        phone,
      });

      if (!pharmacy) {
        return res.status(500).json({ message: "Internal server error" });
      }

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "patient",
        pharmacyId: pharmacy?.id,
      });
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "patient",
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    issueAuthCookie(res, user);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const tokenInfoRes = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
      params: { id_token: credential },
    });

    const tokenInfo = tokenInfoRes.data || {};
    const googleEmail = tokenInfo.email;
    const emailVerified = tokenInfo.email_verified === "true";
    const tokenAudience = tokenInfo.aud;
    const expectedAudience = process.env.GOOGLE_CLIENT_ID;

    if (!googleEmail || !emailVerified) {
      return res.status(400).json({ message: "Google account email is not verified" });
    }

    // If GOOGLE_CLIENT_ID is configured, enforce audience check.
    if (expectedAudience && tokenAudience !== expectedAudience) {
      return res.status(400).json({ message: "Invalid Google token audience" });
    }

    let user = await User.findOne({ where: { email: googleEmail } });

    // First-time Google users default to patient role.
    if (!user) {
      const generatedPassword = await bcrypt.hash(`${googleEmail}-${Date.now()}`, 10);
      user = await User.create({
        name: tokenInfo.name || googleEmail.split("@")[0],
        email: googleEmail,
        password: generatedPassword,
        role: "patient",
      });
    }

    issueAuthCookie(res, user);

    return res.status(200).json({
      message: "Google login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Google login error:", error?.response?.data || error.message);
    return res.status(401).json({ message: "Google authentication failed" });
  }
};

// LOGOUT
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// CURRENT USER
const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, googleLogin, logoutUser, getCurrentUser };
