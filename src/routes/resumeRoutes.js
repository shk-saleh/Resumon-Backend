import express from "express";
import {
  createResume,
  getUserResumes,
  updateResume,
  deleteResume,
  generateShareLink,
  downloadResume,
} from "../controllers/resumeController.js";
import { getUserCredits, useCredit, getDashboardStats,} from "../controllers/creditController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Resume routes
router.get("/", getUserResumes);
router.post("/create", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.post("/:id/share", generateShareLink);
router.post("/:id/download", downloadResume);

// Credit routes
router.get("/users/credits", getUserCredits);
router.post("/users/deduct-credit", useCredit);
router.get("/dashboard/stats", getDashboardStats);

export default router;
