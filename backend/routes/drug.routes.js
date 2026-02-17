const express = require("express");
const router = express.Router();
const {
  addDrug,
  getMyDrugs,
  updateDrug,
  deleteDrug,
} = require("../controllers/drug.controller");

const { verifyToken, isPharmacy } = require("../middleware/auth.middleware");

router.post("/", verifyToken, isPharmacy, addDrug);
router.get("/my", verifyToken, isPharmacy, getMyDrugs);
router.put("/:id", verifyToken, isPharmacy, updateDrug);
router.delete("/:id", verifyToken, isPharmacy, deleteDrug);

module.exports = router;
