const { Pharmacy } = require("../models");

exports.getPharmacies = async (_req, res) => {
  try {
    const pharmacies = await Pharmacy.findAll({ order: [["id", "DESC"]] });
    return res.json(pharmacies);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch pharmacies", details: error.message });
  }
};
