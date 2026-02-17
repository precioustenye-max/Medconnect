const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, isPatient, isPharmacy } = require("../middleware/auth.middleware");

router.post("/", verifyToken, isPatient, orderController.createOrder);
router.get("/my", verifyToken, isPatient, orderController.getMyOrders);
router.get("/:id", verifyToken, orderController.getOrderById);
router.patch("/:id/status", verifyToken, isPharmacy, orderController.updateOrderStatus);

module.exports = router;
