const { Drug, Pharmacy } = require("../models");

const getAuthPharmacy = async (user) => {
  if (!user || !user.pharmacyId) return null;
  return Pharmacy.findByPk(user.pharmacyId);
};

const parseDrugPayload = (body, { partial = false } = {}) => {
  const payload = {};

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      throw new Error("Drug name is required");
    }
    payload.name = body.name.trim();
  }

  if (!partial || body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Drug price must be a positive number");
    }
    payload.price = price;
  }

  if (body.description !== undefined) {
    payload.description = String(body.description || "").trim() || null;
  }
  if (body.category !== undefined) {
    payload.category = String(body.category || "").trim() || null;
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error("Drug stock must be a non-negative integer");
    }
    payload.stock = stock;
  }
  if (body.prescriptionRequired !== undefined) {
    payload.prescriptionRequired = Boolean(body.prescriptionRequired);
  }
  if (body.imageUrl !== undefined) {
    payload.imageUrl = String(body.imageUrl || "").trim() || null;
  }
  if (body.isActive !== undefined) {
    payload.isActive = Boolean(body.isActive);
  }

  return payload;
};

exports.addDrug = async (req, res) => {
  try {
    const pharmacy = await getAuthPharmacy(req.user);
    if (!pharmacy) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }

    const payload = parseDrugPayload(req.body);
    const drug = await Drug.create({
      ...payload,
      pharmacyId: pharmacy.id,
      stock: payload.stock ?? 0,
      isActive: payload.isActive ?? true,
      prescriptionRequired: payload.prescriptionRequired ?? false,
    });

    return res.status(201).json(drug);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to add drug" });
  }
};

exports.getMyDrugs = async (req, res) => {
  try {
    const pharmacy = await getAuthPharmacy(req.user);
    if (!pharmacy) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }

    const drugs = await Drug.findAll({
      where: { pharmacyId: pharmacy.id },
      order: [["id", "DESC"]],
    });

    return res.json(drugs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch drugs", details: error.message });
  }
};

exports.updateDrug = async (req, res) => {
  try {
    const drugId = Number(req.params.id);
    const drug = await Drug.findByPk(drugId);
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }

    const pharmacy = await getAuthPharmacy(req.user);
    if (!pharmacy) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }
    if (Number(drug.pharmacyId) !== Number(pharmacy.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const payload = parseDrugPayload(req.body, { partial: true });
    await drug.update(payload);
    return res.json(drug);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Update failed" });
  }
};

exports.deleteDrug = async (req, res) => {
  try {
    const drugId = Number(req.params.id);
    const drug = await Drug.findByPk(drugId);
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }

    const pharmacy = await getAuthPharmacy(req.user);
    if (!pharmacy) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }
    if (Number(drug.pharmacyId) !== Number(pharmacy.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await drug.destroy();
    return res.json({ message: "Drug deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed", details: error.message });
  }
};
