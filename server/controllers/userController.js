//userController.js
export const getAdminContent = (req, res) => res.send("Welcome, Admin!");
export const getTutorContent = (req, res) => res.send("Welcome, Tutor!");
export const getStudentContent = (req, res) => res.send("Welcome, Student!");
import User from "../models/userModel.js";

// Fetch users by role
export const getUsersByRole = async (req, res, role) => {
  try {
    const users = await User.find({ role }).select("-password");
    if (!users.length) {
      return res.status(404).json({ message: `No ${role}s found` });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};
