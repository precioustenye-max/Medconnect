const { Op } = require("sequelize");
const { Pharmacy, Drug } = require("../models");

const parseBool = (value) => {
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return null;
};

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

exports.listPharmacies = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { q, sort } = req.query;
    const openNow = parseBool(req.query.openNow);
    const delivery = parseBool(req.query.delivery);
    const verified = parseBool(req.query.verified);

    const where = {};
    if (q && q.trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q.trim()}%` } },
        { location: { [Op.like]: `%${q.trim()}%` } },
      ];
    }
    if (openNow !== null) where.isOpen = openNow;
    if (delivery !== null) where.delivery = delivery;
    if (verified !== null) where.verified = verified;

    const orderMap = {
      newest: [["id", "DESC"]],
      rating: [["rating", "DESC"]],
      name: [["name", "ASC"]],
    };

    const { rows, count } = await Pharmacy.findAndCountAll({
      where,
      limit,
      offset,
      order: orderMap[sort] || orderMap.newest,
    });

    return res.json({ items: rows, meta: buildMeta({ page, limit, totalItems: count }) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch pharmacies", details: error.message });
  }
};

exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByPk(Number(req.params.id));
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    const drugsCount = await Drug.count({
      where: { pharmacyId: pharmacy.id, isActive: true },
    });

    return res.json({ ...pharmacy.toJSON(), drugsCount });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch pharmacy", details: error.message });
  }
};

exports.getPharmacyDrugs = async (req, res) => {
  try {
    const pharmacyId = Number(req.params.id);
    if (!Number.isInteger(pharmacyId) || pharmacyId <= 0) {
      return res.status(400).json({ message: "Invalid pharmacy id" });
    }

    const pharmacy = await Pharmacy.findByPk(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    const { page, limit, offset } = getPagination(req.query);
    const where = { pharmacyId, isActive: true };
    const { q } = req.query;
    const inStock = parseBool(req.query.inStock);
    const prescriptionRequired = parseBool(req.query.prescriptionRequired);

    if (q && q.trim()) {
      where.name = { [Op.like]: `%${q.trim()}%` };
    }
    if (inStock === true) where.stock = { [Op.gt]: 0 };
    if (prescriptionRequired !== null) where.prescriptionRequired = prescriptionRequired;

    const { rows, count } = await Drug.findAndCountAll({
      where,
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    return res.json({
      pharmacy,
      items: rows,
      meta: buildMeta({ page, limit, totalItems: count }),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch pharmacy drugs", details: error.message });
  }
};

exports.listDrugs = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { q, category, pharmacyId, sort } = req.query;

    const where = { isActive: true };
    if (q && q.trim()) {
      where.name = { [Op.like]: `%${q.trim()}%` };
    }
    if (category && category.trim()) {
      where.category = category.trim();
    }
    if (pharmacyId && Number(pharmacyId) > 0) {
      where.pharmacyId = Number(pharmacyId);
    }

    const orderMap = {
      name: [["name", "ASC"]],
      priceAsc: [["price", "ASC"]],
      priceDesc: [["price", "DESC"]],
      newest: [["id", "DESC"]],
    };

    const { rows, count } = await Drug.findAndCountAll({
      where,
      include: [{ model: Pharmacy, attributes: ["id", "name", "location", "isOpen", "verified", "delivery", "rating"] }],
      limit,
      offset,
      order: orderMap[sort] || orderMap.name,
    });


    return res.json({ items: rows, meta: buildMeta({ page, limit, totalItems: count }) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch drugs", details: error.message });
  }
};

exports.getDrugById = async (req, res) => {
  try {
    const drug = await Drug.findByPk(Number(req.params.id), {
      include: [{ model: Pharmacy, attributes: ["id", "name", "location", "isOpen", "rating"] }],
    });
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }
    return res.json(drug);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch drug", details: error.message });
  }
};

exports.getDrugPharmacies = async (req, res) => {
  try {
    const drugId = Number(req.params.drugId);
    if (!Number.isInteger(drugId) || drugId <= 0) {
      return res.status(400).json({ message: "Invalid drug id" });
    }

    const selectedDrug = await Drug.findByPk(drugId);
    if (!selectedDrug) {
      return res.status(404).json({ message: "Drug not found" });
    }

    const relatedDrugs = await Drug.findAll({
      where: { name: selectedDrug.name, isActive: true },
      include: [{ model: Pharmacy, attributes: ["id", "name", "location", "isOpen", "licenseNumber", "operatingHours", "serviceType", "verified", "delivery", "rating"] }],
      order: [["price", "ASC"]],
    });

    return res.json({
      drug: selectedDrug,
      items: relatedDrugs.map((entry) => ({
        drug: entry,
        pharmacy: entry.Pharmacy,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch drug pharmacies", details: error.message });
  }
};
