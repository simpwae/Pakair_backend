import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import seedDefaultOfficial from "./src/utils/seedDefaultOfficial.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS Middleware
// In development allow all origins (helps when frontend runs on LAN IPs or different ports).
const isDev = process.env.NODE_ENV !== "production";
if (isDev) {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
} else {
  // Production: allow only configured origins
  const allowedOrigins = (process.env.CORS_ORIGIN &&
    process.env.CORS_ORIGIN.split(",")) || ["https://your-frontend-domain.com"];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
          return callback(null, true);
        }
        return callback(
          new Error("CORS policy: This origin is not allowed - " + origin)
        );
      },
      credentials: true,
    })
  );
}

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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

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
