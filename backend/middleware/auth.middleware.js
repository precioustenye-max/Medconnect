const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Verify JWT
exports.verifyToken = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Check if user is pharmacy
exports.isPharmacy = (req, res, next) => {
  if (req.user.role !== "pharmacy") {
    return res.status(403).json({ message: "Access denied. Pharmacy only." });
  }
  next();
};

// Check if user is patient
exports.isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access denied. Patient only." });
  }
  next();
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};
