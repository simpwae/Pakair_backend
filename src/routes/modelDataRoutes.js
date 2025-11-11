import express from "express";
import {
  getModelData,
  getModelDataById,
} from "../controllers/modelDataController.js";
import { authenticate, isOfficial } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication and official role
router.use(authenticate);
router.use(isOfficial);

// Get all model data
router.get("/", getModelData);

// Get single model data entry
router.get("/:id", getModelDataById);

export default router;
