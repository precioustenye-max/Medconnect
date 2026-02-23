const { Drug, Pharmacy } = require("../models");
const fs = require("fs/promises");
const path = require("path");

const getAuthPharmacy = async (user) => {
  if (!user || !user.pharmacyId) return null;
  return Pharmacy.findByPk(user.pharmacyId);
};

const uploadDir = path.join(__dirname, "..", "uploads", "drugs");

const imageExtensionByMime = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const toAbsoluteUploadUrl = (req, relativePath) => {
  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}${relativePath}`;
};

const persistDataUrlImageIfNeeded = async (req, value) => {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // If this is already a normal URL/path, keep it as-is.
  if (!trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  const match = trimmed.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image format");
  }

  const mime = match[1];
  const base64Data = match[2];
  const ext = imageExtensionByMime[mime];
  if (!ext) {
    throw new Error("Unsupported image type. Use JPG, PNG, WEBP, or GIF.");
  }

  const buffer = Buffer.from(base64Data, "base64");
  if (!buffer?.length) {
    throw new Error("Invalid image payload");
  }

  await fs.mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  const relativeUrl = `/uploads/drugs/${filename}`;
  return toAbsoluteUploadUrl(req, relativeUrl);
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
    if (payload.imageUrl !== undefined) {
      payload.imageUrl = await persistDataUrlImageIfNeeded(req, payload.imageUrl);
    }

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
    if (payload.imageUrl !== undefined) {
      payload.imageUrl = await persistDataUrlImageIfNeeded(req, payload.imageUrl);
    }

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
