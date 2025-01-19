//courseRoutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseDetails,
  createChapter,
  createContents,
  createQuizzes,
} from "../controllers/coursesController.js";

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Folder to store files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Upload Storage 
const upload = multer({ storage:storage});


// Create a new course (Admin and Tutor only)
router.post("/", protect, authorize("Admin", "Tutor"),upload.single("CourseImg"), createCourse);
// Create a new chapter (Admin and Tutor only)
router.post("/chapter", protect, authorize("Admin", "Tutor"),upload.single("ChapterVideo"), createChapter);
// Create a new content (Admin and Tutor only)
router.post("/content", protect, authorize("Admin", "Tutor"),upload.single("ContentMaterails"), createContents);
// Create a new Quiz (Admin and Tutor only)
router.post("/quizzes", protect, authorize("Admin", "Tutor"), createQuizzes);

// Get all courses (accessible to all roles)
router.get("/", getCourseDetails);

// Get a specific course by ID (accessible to all roles)
router.get("/:id", getCourseById);

// Update a course (Admin and Tutor only)
router.put("/:id", protect, authorize("Admin", "Tutor"), updateCourse);

// Delete a course (Admin only)
router.delete("/:id", protect, authorize("Admin"), deleteCourse);

export default router;
