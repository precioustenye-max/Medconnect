const db = require("../models");
const { sequelize } = db;

const ORDER_STATUSES = ["pending", "paid", "processing", "delivered", "cancelled"];

const makeHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const orderInclude = [
  {
    model: db.User,
    attributes: ["id", "name", "email"],
  },
  {
    model: db.OrderItem,
    attributes: ["id", "drugId", "quantity", "price", "createdAt"],
    include: [
      {
        model: db.Drug,
        attributes: ["id", "name", "price", "pharmacyId"],
      },
    ],
  },
];

exports.createOrder = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const { pharmacyId, items, paymentMethod, deliveryAddress } = req.body;
    const userId = req.user && req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (!pharmacyId) {
      return res.status(400).json({ message: "pharmacyId is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let totalAmount = 0;

    const orderItemsPayload = [];

    // Validate drugs and calculate total.
    for (const item of items) {
      if (!item.drugId || !item.quantity || item.quantity <= 0) {
        throw makeHttpError(400, "Each item must include valid drugId and quantity");
      }

      const drug = await db.Drug.findByPk(item.drugId, { transaction });

      if (!drug) {
        throw makeHttpError(404, `Drug with ID ${item.drugId} not found`);
      }

      if (Number(drug.pharmacyId) !== Number(pharmacyId)) {
        throw makeHttpError(400, `Drug ${item.drugId} does not belong to pharmacy ${pharmacyId}`);
      }

      if (Number(drug.stock || 0) < Number(item.quantity)) {
        throw makeHttpError(400, `Insufficient stock for drug ${item.drugId}`);
      }

      const unitPrice = Number(drug.price);
      totalAmount += unitPrice * Number(item.quantity);

      orderItemsPayload.push({
        drugId: item.drugId,
        quantity: Number(item.quantity),
        price: unitPrice,
      });
    }

    // Create order first, then add order items under same transaction.
    const order = await db.Order.create(
      {
        pharmacyId: Number(pharmacyId),
        userId: Number(userId),
        totalAmount,
        paymentMethod: paymentMethod || null,
        deliveryAddress: deliveryAddress || null,
      },
      { transaction }
    );

    for (const item of orderItemsPayload) {
      await db.OrderItem.create(
        {
          orderId: order.id,
          drugId: Number(item.drugId),
          quantity: item.quantity,
          price: item.price,
        },
        { transaction }
      );

      await db.Drug.decrement("stock", {
        by: Number(item.quantity),
        where: { id: Number(item.drugId) },
        transaction,
      });
    }

    await transaction.commit();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Order creation failed" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      where: { userId: req.user.id },
      include: orderInclude,
      order: [["id", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await db.Order.findByPk(orderId, {
      include: orderInclude,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwnerPatient = req.user.role === "patient" && Number(order.userId) === Number(req.user.id);
    const isOwnerPharmacy = req.user.role === "pharmacy" && Number(order.pharmacyId) === Number(req.user.pharmacyId);
    const isAdmin = req.user.role === "admin";

    if (!isOwnerPatient && !isOwnerPharmacy && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await db.Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (Number(order.pharmacyId) !== Number(req.user.pharmacyId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await order.update({ status });

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
