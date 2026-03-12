const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getMyPrescriptions,
  deleteMyPrescription,
  getMyPharmacyPrescriptions,
  reviewPrescription,
  payForPrescription,
} = require("../controllers/prescription.controller");
const { verifyToken, isPatient, isPharmacy } = require("../middleware/auth.middleware");

router.post("/", verifyToken, isPatient, createPrescription);
router.get("/my", verifyToken, isPatient, getMyPrescriptions);
router.delete("/:id", verifyToken, isPatient, deleteMyPrescription);
router.post("/:id/pay", verifyToken, isPatient, payForPrescription);

router.get("/pharmacy/my", verifyToken, isPharmacy, getMyPharmacyPrescriptions);
router.patch("/:id/review", verifyToken, isPharmacy, reviewPrescription);

module.exports = router;
