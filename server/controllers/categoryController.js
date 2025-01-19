//categoryController.js
import Category from "../models/categoryModel.js";


// Create a new category
export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Validate the file exists
    if (!req.file) {
      return res.status(400).json({ message: "Image upload is required" });
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create category in the database
    const category = await Category.create({
      name,
      image: req.file.path, // Cloudinary URL
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};
// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("createdBy", "name email role");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("createdBy", "name email role");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
};

// Delete a category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.remove();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};
