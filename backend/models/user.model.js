const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const User = sequelize.define("User", {
  id: {
     type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true 
    },

  name: { 
    type: DataTypes.STRING,
    allowNull: false
     },
  email: {
     type: DataTypes.STRING,
      allowNull: false,
      unique: true
     },
  password: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  role: {
    type: DataTypes.ENUM("patient","pharmacy","admin"), defaultValue: "patient"
  },
  pharmacyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "pharmacy_id",
  },
  createdAt: { 
    type: DataTypes.DATE, defaultValue: DataTypes.NOW
   },
  updatedAt: {
    type: DataTypes.DATE, defaultValue: DataTypes.NOW
  } 
});

module.exports = User;
