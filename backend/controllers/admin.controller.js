const { Op } = require("sequelize");
const { User, Pharmacy, Drug, Order } = require("../models");

const getPagination = (query, defaultLimit = 12) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const buildMeta = ({ page, limit, totalItems }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

exports.getStats = async (_req, res) => {
  try {
    const [usersCount, pharmaciesCount, drugsCount, ordersCount, totalRevenue, latestOrders] = await Promise.all([
      User.count(),
      Pharmacy.count(),
      Drug.count({ where: { isActive: true } }),
      Order.count(),
      Order.sum("totalAmount"),
      Order.findAll({
        limit: 5,
        order: [["id", "DESC"]],
        include: [
          { model: User, attributes: ["id", "name", "email"] },
          { model: Pharmacy, attributes: ["id", "name"] },
        ],
      }),
    ]);

    return res.json({
      totals: {
        users: usersCount,
        pharmacies: pharmaciesCount,
        drugs: drugsCount,
        orders: ordersCount,
        revenue: Number(totalRevenue || 0),
      },
      recentOrders: latestOrders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load admin stats", details: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { q, role } = req.query;

    const where = {};
    if (q && q.trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q.trim()}%` } },
        { email: { [Op.like]: `%${q.trim()}%` } },
      ];
    }
    if (role && role.trim()) where.role = role.trim();

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: ["id", "name", "email", "role", "pharmacyId", "createdAt"],
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    return res.json({ items: rows, meta: buildMeta({ page, limit, totalItems: count }) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load users", details: error.message });
  }
};

exports.getPharmacies = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { q } = req.query;

    const where = {};
    if (q && q.trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q.trim()}%` } },
        { location: { [Op.like]: `%${q.trim()}%` } },
      ];
    }

    const { rows, count } = await Pharmacy.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({ items: rows, meta: buildMeta({ page, limit, totalItems: count }) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load pharmacies", details: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status } = req.query;

    const where = {};
    if (status && status.trim()) where.status = status.trim();

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Pharmacy, attributes: ["id", "name", "location"] },
      ],
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    return res.json({ items: rows, meta: buildMeta({ page, limit, totalItems: count }) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load orders", details: error.message });
  }
};
