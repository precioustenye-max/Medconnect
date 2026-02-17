const express = require("express");
const router = express.Router();
const {
  listPharmacies,
  getPharmacyById,
  getPharmacyDrugs,
  listDrugs,
  getDrugById,
  getDrugPharmacies,
} = require("../controllers/public.controller");

router.get("/pharmacies", listPharmacies);
router.get("/pharmacies/:id", getPharmacyById);
router.get("/pharmacies/:id/drugs", getPharmacyDrugs);

router.get("/drugs", listDrugs);
router.get("/drugs/:drugId/pharmacies", getDrugPharmacies);
router.get("/drugs/:id", getDrugById);

module.exports = router;
