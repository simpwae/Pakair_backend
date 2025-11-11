import express from "express";
import dotenv from "dotenv";
import connectDB from "../src/config/database.js";
import authRoutes from "../src/routes/authRoutes.js";
import reportRoutes from "../src/routes/reportRoutes.js";
import modelDataRoutes from "../src/routes/modelDataRoutes.js";
import recommendationRoutes from "../src/routes/recommendationRoutes.js";
import featureRoutes from "../src/routes/featureRoutes.js";
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

// Test route to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// API Routes - REGISTER THESE FIRST
console.log("📝 Registering API routes...");
try {
  app.use("/api/auth", authRoutes);
  console.log("✅ Auth routes registered");
} catch (error) {
  console.error("❌ Auth routes failed:", error);
}

try {
  app.use("/api/reports", reportRoutes);
  console.log("✅ Report routes registered");
} catch (error) {
  console.error("❌ Report routes failed:", error);
}

try {
  app.use("/api/model-data", modelDataRoutes);
  console.log("✅ Model data routes registered");
} catch (error) {
  console.error("❌ Model data routes failed:", error);
}

try {
  app.use("/api/recommendations", recommendationRoutes);
  console.log("✅ Recommendation routes registered");
} catch (error) {
  console.error("❌ Recommendation routes failed:", error);
}

try {
  app.use("/api/features", featureRoutes);
  console.log("✅ Feature routes registered");
} catch (error) {
  console.error("❌ Feature routes failed:", error);
}

// List all registered routes for debugging
app.get("/api/routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      });
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods),
          });
        }
      });
    }
  });
  res.json({ routes, totalRoutes: routes.length });
});

// 404 handler - LAST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found: " + req.method + " " + req.url,
    availableRoutes: "Visit /api/routes to see all registered routes",
  });
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
