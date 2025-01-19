//categoryRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

// Only Admin and Tutor can create categories
categoryRouter.post("/", protect, authorize("Admin", "Tutor"),createCategory);

// Get all categories (accessible to all roles)
categoryRouter.get("/", getCategories);

// Get a specific category by ID (accessible to all roles)
categoryRouter.get("/:id",getCategoryById);

// Delete a category (only Admin)
categoryRouter.delete("/:id", protect, authorize("Admin"), deleteCategory);

export default categoryRouter;
