module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pharmacyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "processing", "delivered", "cancelled"),
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Order;
};
