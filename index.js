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

// NUCLEAR CORS FIX - Allow everything (production safe)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

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

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(
    `📨 ${req.method} ${req.url} - Origin: ${req.headers.origin || "none"}`
  );
  next();
});

// API Routes
console.log("🔧 Registering routes...");
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes registered");
app.use("/api/reports", reportRoutes);
console.log("✅ Report routes registered");
app.use("/api/model-data", modelDataRoutes);
console.log("✅ Model data routes registered");
app.use("/api/recommendations", recommendationRoutes);
console.log("✅ Recommendation routes registered");

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

// Initialize database connection and seed data
const initializeApp = async () => {
  try {
    console.log("🚀 Initializing application...");
    await connectDB();
    console.log("✅ Database connected");
    await seedDefaultOfficial();
    console.log("✅ Default official seeded");
  } catch (error) {
    console.error("❌ Initialization error:", error.message);
  }
};

// For Vercel serverless deployment
if (process.env.VERCEL) {
  console.log("🔷 Running on Vercel (serverless)");
  initializeApp();
} else {
  // For local development
  const startServer = async () => {
    try {
      await initializeApp();
      app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
        console.log(`📍 http://localhost:${port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    }
  };
  startServer();
}

// Export for Vercel serverless functions
export default app;
