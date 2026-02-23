module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define("Prescription", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pharmacyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    drugName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documentUrl: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("submitted", "verified", "rejected"),
      allowNull: false,
      defaultValue: "submitted",
    },
    rejectionReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Prescription;
};
