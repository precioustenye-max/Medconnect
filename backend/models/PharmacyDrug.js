module.exports = (sequelize, DataTypes) => {
  const PharmacyDrug = sequelize.define("PharmacyDrug", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pharmacyId: {
       type: DataTypes.INTEGER,
       allowNull: true,
       field: "pharmacy_id",
     },
  }, {
    timestamps: false,
  });

  return PharmacyDrug;
};


