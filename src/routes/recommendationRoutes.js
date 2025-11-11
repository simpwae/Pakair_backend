import express from "express";
import {
  getRecommendations,
  getRecommendationById,
} from "../controllers/recommendationController.js";
import { authenticate, isOfficial } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication and official role
router.use(authenticate);
router.use(isOfficial);

// Get all recommendations
router.get("/", getRecommendations);

// Get single recommendation entry
router.get("/:id", getRecommendationById);

export default router;
