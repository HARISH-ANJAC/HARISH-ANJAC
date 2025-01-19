//coursesController.js
import Chapter from "../models/chapterModel.js";
import Course from "../models/courseModel.js";
import contentModel from "../models/contentModel.js";
import quizModel from "../models/quizModel.js";
import path from "path";


// Create a new course
export const createCourse = async (req, res) => {
  const { title, description, categories, duration, price } = req.body;
  const fileData = req.file;

  if (!fileData) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const course = await Course.create({
      title,
      description,
      categories,
      duration,
      price,
      image: {
        originalName: fileData.originalname,
        mimeType: fileData.mimetype,
        size: fileData.size,
        path: fileData.path,
      },
      createdBy: req.user._id, // Authenticated user
    });

    res.status(201).json({
      message: "Course created successfully",
      course: {
        ...course.toObject(),
        imageUrl: `${req.protocol}:/${req.get("host")}/${fileData.path}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

// Get all courses
export const getCourseDetails = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("chapters") // Populate chapters
      .populate("contents") // Populate contents
      .populate("quizzes") // Populate quizzes
      .populate("createdBy", "name email role"); // Populate creator details


    // Format each course to include an absolute URL for the image
    const formattedCourses = courses.map((course) => ({
      ...course.toObject(),
      imageUrl: `${req.protocol}:/${req.get("host")}/${course.image?.path || ""}`,
    }));

    res.status(200).json(formattedCourses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};


// Get a specific course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("chapters",) // Populate chapter fields") // Populate specific chapter fields
      .populate("contents") // Populate content fields
      .populate("quizzes") // Populate quiz fields
      .populate("createdBy", "name email role"); // Include creator details

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Add the image URL to the course object
    const formattedCourse = {
      ...course.toObject(),
      imageUrl: `${req.protocol}://${req.get("host")}/${course.image?.path || ""}`,
    };

    res.status(200).json(formattedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

// Update a specific course by ID
export const updateCourse = async (req, res) => {
  const { title, description, categories, duration, price, chapters, contents, quizzes } = req.body;
  
  try {
    const image = req.file?.path; // Update image if provided
    const updateFields = {
      title,
      description,
      categories,
      duration,
      price,
      chapters,
      contents,
      quizzes,
    };

    if (image) updateFields.image = image;

    const course = await Course.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};


//Delete the course by ID

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};

// Add the new Chapters


export const createChapter = async (req, res) => {
  const { title, postUserName, courseId } = req.body;
  const fileData = req.file;

  if (!fileData) {
    return res.status(400).json({ message: "Image is required" });
  }

  console.log("Id",courseId);
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });


    
    const chapter = await Chapter.create({
      title: title,
      postUserName:postUserName ,    
      file:{
        originalName: fileData.originalname,
        mimeType: fileData.mimetype,
        size: fileData.size,
        path: fileData.path,
      },
      course: courseId,
    });

    // Add chapter to the course
    course.chapters.push(chapter._id);
    await course.save();

    res.status(201).json({ message: "Chapter created successfully", chapter });
  } catch (error) {
    res.status(500).json({ message: "Error creating chapter", error: error.message });
  }
};

// Add the new Contents
export const createContents = async (req, res) => {
  const { title, postUserName, courseId } = req.body;

  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  // Validate input
  if (!title || !postUserName || !courseId || !req.file) {
    return res.status(400).json({ 
      message: "Missing required fields", 
      fields: { title, postUserName, courseId, file: req.file ? req.file.path : null } 
    });
  }

  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: `Course not found with ID: ${courseId}` });
    }

    // Create the content
    const content = await contentModel.create({
      title,
      postUserName,
      file: req.file.path, // Cloudinary URL
      course: courseId,
    });

    // Associate content with the course
    course.contents.push(content._id);
    await course.save();

    res.status(201).json({ message: "Content created successfully", content });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Error creating content", error: error.message });
  }
};



// Add the new Quizzes


export const createQuizzes = async (req, res) => {
  const { title, duration, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const QuizContent = await quizModel.create({
      title,
      duration,
      course: courseId,
    });

    // Add chapter to the course
    course.quizzes.push(QuizContent._id);
    await course.save();

    res.status(201).json({ message: "Chapter created successfully", QuizContent });
  } catch (error) {
    res.status(500).json({ message: "Error creating chapter", error: error.message });
  }
};