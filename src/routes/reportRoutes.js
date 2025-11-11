import express from "express";
import {
  createReport,
  getReports,
  getReport,
  verifyReport,
  rejectReport,
  deleteReport,
} from "../controllers/reportController.js";
import {
  authenticate,
  isOfficial,
  isCitizen,
} from "../middlewares/authMiddleware.js";
import {
  uploadSingle,
  handleUploadError,
} from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all reports (both citizens and officials can view)
router.get("/", getReports);

// Get single report
router.get("/:id", getReport);

// Create report (citizens only)
router.post("/", isCitizen, uploadSingle, handleUploadError, createReport);

// Verify report (officials only)
router.patch("/:id/verify", isOfficial, verifyReport);

// Reject report (officials only)
router.patch("/:id/reject", isOfficial, rejectReport);

// Delete report (officials only)
router.delete("/:id", isOfficial, deleteReport);

export default router;
