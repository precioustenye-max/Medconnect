const { Prescription, Pharmacy, User, Notification } = require("../models");

const parsePositiveInt = (value) => {
  const next = Number(value);
  if (!Number.isInteger(next) || next <= 0) return null;
  return next;
};

exports.createPrescription = async (req, res) => {
  try {
    const userId = req.user?.id;
    const pharmacyId = parsePositiveInt(req.body?.pharmacyId);
    const drugName = String(req.body?.drugName || "").trim();
    const patientName = String(req.body?.patientName || "").trim();
    const doctorName = String(req.body?.doctorName || "").trim();
    const notes = String(req.body?.notes || "").trim() || null;
    const documentUrl = String(req.body?.documentUrl || "").trim() || null;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!pharmacyId) {
      return res.status(400).json({ message: "Valid pharmacyId is required" });
    }
    if (!drugName || !patientName || !doctorName) {
      return res.status(400).json({ message: "drugName, patientName, and doctorName are required" });
    }

    const pharmacy = await Pharmacy.findByPk(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    const prescription = await Prescription.create({
      userId: Number(userId),
      pharmacyId,
      drugName,
      patientName,
      doctorName,
      notes,
      documentUrl,
      status: "submitted",
    });

    return res.status(201).json({ message: "Prescription submitted", prescription });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit prescription", details: error.message });
  }
};

exports.getMyPrescriptions = async (req, res) => {
  try {
    const items = await Prescription.findAll({
      where: { userId: Number(req.user.id) },
      include: [{ model: Pharmacy, attributes: ["id", "name", "location"] }],
      order: [["id", "DESC"]],
    });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch prescriptions", details: error.message });
  }
};

exports.deleteMyPrescription = async (req, res) => {
  try {
    const prescriptionId = parsePositiveInt(req.params.id);
    if (!prescriptionId) {
      return res.status(400).json({ message: "Invalid prescription id" });
    }

    const prescription = await Prescription.findByPk(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    if (Number(prescription.userId) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (prescription.status !== "submitted") {
      return res.status(400).json({ message: "Only submitted prescriptions can be deleted" });
    }

    await prescription.destroy();
    return res.json({ message: "Prescription deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete prescription", details: error.message });
  }
};

exports.getMyPharmacyPrescriptions = async (req, res) => {
  try {
    if (!req.user?.pharmacyId) {
      return res.status(403).json({ message: "Pharmacy profile not found" });
    }

    const items = await Prescription.findAll({
      where: { pharmacyId: Number(req.user.pharmacyId) },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["id", "DESC"]],
    });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch pharmacy prescriptions", details: error.message });
  }
};

exports.reviewPrescription = async (req, res) => {
  try {
    const prescriptionId = parsePositiveInt(req.params.id);
    const status = String(req.body?.status || "").trim();
    const rejectionReason = String(req.body?.rejectionReason || "").trim() || null;

    if (!prescriptionId) {
      return res.status(400).json({ message: "Invalid prescription id" });
    }
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be either verified or rejected" });
    }
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({ message: "rejectionReason is required when rejecting a prescription" });
    }

    const prescription = await Prescription.findByPk(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    if (Number(prescription.pharmacyId) !== Number(req.user?.pharmacyId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prescription.update({
      status,
      rejectionReason: status === "rejected" ? rejectionReason : null,
      reviewedAt: new Date(),
    });

    // Create notification for the user
    await Notification.create({
      userId: prescription.userId,
      type: "prescription_status",
      title: `Prescription ${status}`,
      message: 
        status === "verified" 
          ? `Your prescription for ${prescription.drugName} has been verified and is ready for collection.`
          : `Your prescription for ${prescription.drugName} has been rejected. Reason: ${rejectionReason}`,
      relatedId: prescriptionId,
    });

    return res.json({ message: "Prescription reviewed", prescription });
  } catch (error) {
    return res.status(500).json({ message: "Failed to review prescription", details: error.message });
  }
};

exports.payForPrescription = async (req, res) => {
  try {
    const prescriptionId = parsePositiveInt(req.params.id);
    if (!prescriptionId) {
      return res.status(400).json({ message: "Invalid prescription id" });
    }

    const prescription = await Prescription.findByPk(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    if (Number(prescription.userId) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (prescription.status !== "verified") {
      return res.status(400).json({ message: "Only verified prescriptions can be paid" });
    }

    await prescription.destroy();

    return res.json({ message: "Payment recorded. Prescription removed." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process payment", details: error.message });
  }
};
