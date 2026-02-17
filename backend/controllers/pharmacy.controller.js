const { Order, User, OrderItem, Drug } = require("../models");

exports.getMyPharmacyProfile = async (req, res) => {
  try {
    if (!req.user.pharmacyId) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }

    const pharmacy = await req.user.getPharmacy({
      attributes: [
        "id",
        "name",
        "location",
        "phone",
        "licenseNumber",
        "operatingHours",
        "serviceType",
        "verified",
        "delivery",
        "isOpen",
        "rating",
      ],
    });

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy profile not found" });
    }

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pharmacy profile",
      error: error.message,
    });
  }
};

exports.updateMyPharmacyProfile = async (req, res) => {
  try {
    if (!req.user.pharmacyId) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }

    const pharmacy = await req.user.getPharmacy();
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy profile not found" });
    }

    const updates = {};
    if (typeof req.body.name === "string" && req.body.name.trim()) {
      updates.name = req.body.name.trim();
    }
    if (typeof req.body.location === "string" && req.body.location.trim()) {
      updates.location = req.body.location.trim();
    }
    if (typeof req.body.phone === "string") {
      updates.phone = req.body.phone.trim() || null;
    }
    if (typeof req.body.licenseNumber === "string") {
      updates.licenseNumber = req.body.licenseNumber.trim() || null;
    }
    if (typeof req.body.operatingHours === "string") {
      updates.operatingHours = req.body.operatingHours.trim() || null;
    }
    if (typeof req.body.serviceType === "string") {
      updates.serviceType = req.body.serviceType.trim() || null;
    }
    if (typeof req.body.delivery === "boolean") {
      updates.delivery = req.body.delivery;
    }
    if (typeof req.body.isOpen === "boolean") {
      updates.isOpen = req.body.isOpen;
    }

    await pharmacy.update(updates);

    res.json({
      message: "Pharmacy profile updated successfully",
      pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update pharmacy profile",
      error: error.message,
    });
  }
};

exports.getPharmacyOrders = async (req, res) => {
  try {
    const pharmacyId = Number(req.params.pharmacyId);

    if (!Number.isInteger(pharmacyId) || pharmacyId <= 0) {
      return res.status(400).json({ message: "Invalid pharmacyId" });
    }

    // Pharmacy users can only access their own orders.
    if (Number(req.user.pharmacyId) !== pharmacyId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const orders = await Order.findAll({
      where: { pharmacyId },
      attributes: ["id", "status", "totalAmount", "paymentMethod", "deliveryAddress", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: OrderItem,
          attributes: ["id", "drugId", "quantity", "price", "createdAt"],
          include: [
            {
              model: Drug,
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pharmacy orders",
      error: error.message,
    });
  }
};

exports.getMyPharmacyOrders = async (req, res) => {
  try {
    if (!req.user.pharmacyId) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }

    const orders = await Order.findAll({
      where: { pharmacyId: Number(req.user.pharmacyId) },
      attributes: ["id", "status", "totalAmount", "paymentMethod", "deliveryAddress", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: OrderItem,
          attributes: ["id", "drugId", "quantity", "price", "createdAt"],
          include: [
            {
              model: Drug,
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pharmacy orders",
      error: error.message,
    });
  }
};
