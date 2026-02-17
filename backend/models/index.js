const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../utils/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Pharmacy = require("./Pharmacy")(sequelize, DataTypes);
db.Drug = require("./Drug")(sequelize, DataTypes);
db.Order = require("./Order")(sequelize, DataTypes);
db.OrderItem = require("./OrderItem")(sequelize, DataTypes);
db.User = require("./user.model");


// Pharmacy - Drug (1:M)
db.Pharmacy.hasMany(db.Drug, { foreignKey: "pharmacyId" });
db.Drug.belongsTo(db.Pharmacy, { foreignKey: "pharmacyId" });

// User - Pharmacy (M:1)
db.User.belongsTo(db.Pharmacy, { foreignKey: "pharmacyId" });
db.Pharmacy.hasMany(db.User, { foreignKey: "pharmacyId" });

// Pharmacy - Order (1:M)
db.Pharmacy.hasMany(db.Order, { foreignKey: "pharmacyId" });
db.Order.belongsTo(db.Pharmacy, { foreignKey: "pharmacyId" });

// User - Order (1:M)
db.User.hasMany(db.Order, { foreignKey: "userId" });
db.Order.belongsTo(db.User, { foreignKey: "userId" });

// Order - OrderItem (1:M)
db.Order.hasMany(db.OrderItem, { foreignKey: "orderId" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "orderId" });

// Drug - OrderItem (1:M)
db.Drug.hasMany(db.OrderItem, { foreignKey: "drugId" });
db.OrderItem.belongsTo(db.Drug, { foreignKey: "drugId" });

module.exports = db;
