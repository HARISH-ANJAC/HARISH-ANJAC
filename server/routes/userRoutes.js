//userRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { getAdminContent, getTutorContent, getStudentContent, getUsersByRole } from "../controllers/userController.js";

const router = express.Router();

// Admin-specific routes
router.get("/students", protect, authorize("Admin"), (req, res) => getUsersByRole(req, res, "Student"));
router.get("/tutors", protect, authorize("Admin"), (req, res) => getUsersByRole(req, res, "Tutor"));

// Role-specific content routes
router.get("/admin", protect, authorize("Admin"), getAdminContent);
router.get("/tutor", protect, authorize("Tutor", "Admin"), getTutorContent);
router.get("/student", protect, authorize("Student", "Tutor", "Admin"), getStudentContent);

export default router;
