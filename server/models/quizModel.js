//quizModel.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Reference to the course
    required: true,
  },
});

export default mongoose.model("Quiz", quizSchema);
