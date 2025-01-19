//authController.js
import User from "../models/userModel.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/jwtUtils.js";
import { sendNewPasswordEmail } from "../services/emailService.js";


// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role,phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    

    const user = await User.create({ name, email, password, role,phone });
    res.status(201).json({ user: { id: user._id,email:user.email,phone:user.phone, name: user.name, role: user.role }});
  } catch (error) {
    res.status(500).json({ message: "Server error",error:error });
    console.log(error.message);
    
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password,role } = req.body;

  try {
    const user = await User.findOne({ email });
    const isMatch = await bcryptjs.compare(password, user.password);
    
    
    if (!isMatch) {
      return res.status(400).json({ msg: "login mismatch" });
    }
    if (role === user.role) {
      res.status(200).json({ msg:'Login Success'  ,token: generateToken(user) });
    }else{
      res.status(300).json({ msg:'User Not Access'});
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Forget password User
export const forgetpassword = async (req, res) => {
  

  try {
    const { email} = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User does not exist');
      return res.status(400).json({ msg: 'User does not exist' });
    }
    const userName=user.name;

    // Generate a new password
    const newPassword = crypto.randomBytes(4).toString('hex'); // Generate an 8-character password
    console.log('Generated new password:', newPassword);

    // Hash the new password
 /*   const hashedPassword = await bcryptjs.hash(newPassword, 10);
    console.log('Hashed new password:', hashedPassword);

    // Update the user's password in the database
   // user.password = hashedPassword;*/
    user.password = newPassword;

    const savedUser = await user.save();
    console.log('Updated user:', savedUser);

    // Send the new password to the user's email
    sendNewPasswordEmail(email, newPassword,userName);

    return res.status(200).json({ msg: 'New password sent to your email' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
