import express from "express";
import dotenv from "dotenv";
import connectDB from "../src/config/database.js";
import authRoutes from "../src/routes/authRoutes.js";
import reportRoutes from "../src/routes/reportRoutes.js";
import modelDataRoutes from "../src/routes/modelDataRoutes.js";
import recommendationRoutes from "../src/routes/recommendationRoutes.js";
import seedDefaultOfficial from "../src/utils/seedDefaultOfficial.js";

dotenv.config();

const app = express();

// CORS - Allow everything
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
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "PakAir API Server",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Debug route
app.get("/debug", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    requestOrigin: req.headers.origin || "no origin",
    timestamp: new Date().toISOString(),
  });
});

// API Routes - REGISTER THESE FIRST
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/model-data", modelDataRoutes);
app.use("/api/recommendations", recommendationRoutes);

// 404 handler - LAST
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: "Route not found: " + req.url });
});

// Initialize DB on cold start
let initialized = false;
const initializeApp = async () => {
  if (!initialized) {
    try {
      console.log("🚀 Initializing...");
      await connectDB();
      console.log("✅ DB connected");
      await seedDefaultOfficial();
      console.log("✅ Official seeded");
      initialized = true;
    } catch (error) {
      console.error("❌ Init error:", error.message);
    }
  }
};

// Initialize immediately for Vercel
initializeApp();

export default app;
