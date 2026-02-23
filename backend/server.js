require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const { connectDB, sequelize } = require("./utils/db");

const authRoutes = require("./routes/auth.routes");
const drugRoutes = require("./routes/drug.routes");
const orderRoutes = require("./routes/order.routes");
const pharmacyRoutes = require("./routes/pharmacy.routes");
const publicRoutes = require("./routes/public.routes");
const adminRoutes = require("./routes/admin.routes");
const prescriptionRoutes = require("./routes/prescription.routes");

const app = express();
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://medconnect-mu.vercel.app",
];
const envOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

// GLOBAL MIDDLEWARE
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" &&
          (origin.startsWith("http://localhost:") ||
            origin.startsWith("http://127.0.0.1:")));
      if (isAllowed) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/drugs", drugRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// ROOT TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "MedConnect API Running" });
});

const PORT = process.env.PORT || 5000;
const shouldAlterSchema = process.env.DB_ALTER === "true";

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    await sequelize.sync({ alter: shouldAlterSchema });
    console.log(`All models synced${shouldAlterSchema ? " (alter enabled)" : ""}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.log("Starting server WITHOUT database...");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
