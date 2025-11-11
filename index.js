import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import modelDataRoutes from "./src/routes/modelDataRoutes.js";
import recommendationRoutes from "./src/routes/recommendationRoutes.js";
import seedDefaultOfficial from "./src/utils/seedDefaultOfficial.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS Middleware - Allow all Vercel deployments
const isDev = process.env.NODE_ENV !== "production";
console.log(`🌍 Environment: ${isDev ? "Development" : "Production"}`);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log(
        `📡 Request from origin: ${origin || "no origin (direct/Postman)"}`
      );

      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) {
        console.log("✅ Allowing request with no origin");
        return callback(null, true);
      }

      // In development, allow all
      if (isDev) {
        console.log("✅ Development mode - allowing all origins");
        return callback(null, true);
      }

      // In production, allow all Vercel apps and configured origins
      const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
        : [];

      const isVercelApp = origin.includes(".vercel.app");
      const isAllowedOrigin = allowedOrigins.some((allowed) =>
        origin.includes(allowed.replace("https://", "").replace("http://", ""))
      );

      if (isVercelApp || isAllowedOrigin) {
        console.log("✅ Allowing origin:", origin);
        return callback(null, true);
      }

      console.log("❌ Blocking origin:", origin);
      return callback(new Error("CORS policy: Origin not allowed - " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "PakAir API Server",
    version: "1.0.0",
    status: "running",
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Debug route to check CORS and environment
app.get("/debug", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ORIGIN || "not set",
    requestOrigin: req.headers.origin || "no origin header",
    requestHeaders: req.headers,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/model-data", modelDataRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultOfficial();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
