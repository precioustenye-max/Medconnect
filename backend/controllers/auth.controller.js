const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pharmacy, User } = require("../models");

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

    // Generate JWT
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

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
