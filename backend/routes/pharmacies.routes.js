const express = require("express");
const router = express.Router();
const {
  getPharmacies
} = require("../controllers/pharmacies.controller");

router.get("/", getPharmacies);

module.exports = router;
