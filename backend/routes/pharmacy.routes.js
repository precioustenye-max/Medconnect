const express = require("express");
const router = express.Router();
const { verifyToken, isPharmacy } = require("../middleware/auth.middleware");
const {
  getPharmacyOrders,
  getMyPharmacyOrders,
  getMyPharmacyProfile,
  updateMyPharmacyProfile,
} = require("../controllers/pharmacy.controller");

router.get("/me", verifyToken, isPharmacy, getMyPharmacyProfile);
router.patch("/me", verifyToken, isPharmacy, updateMyPharmacyProfile);
router.get("/me/orders", verifyToken, isPharmacy, getMyPharmacyOrders);
router.get("/:pharmacyId/orders", verifyToken, isPharmacy, getPharmacyOrders);

module.exports = router;
