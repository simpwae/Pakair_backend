import express from "express";
import { getFeatureStatus } from "../controllers/featureController.js";

const router = express.Router();

// Get current feature flags status
router.get("/status", getFeatureStatus);

export default router;
