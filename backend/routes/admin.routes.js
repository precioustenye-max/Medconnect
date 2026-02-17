const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { getStats, getUsers, getPharmacies, getOrders } = require("../controllers/admin.controller");

router.get("/stats", verifyToken, isAdmin, getStats);
router.get("/users", verifyToken, isAdmin, getUsers);
router.get("/pharmacies", verifyToken, isAdmin, getPharmacies);
router.get("/orders", verifyToken, isAdmin, getOrders);

module.exports = router;
