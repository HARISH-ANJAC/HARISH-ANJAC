//jwtUtils.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export default function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
    },

    process.env.JWT_SECRET
    //{ expiresIn: process.env.JWT_EXPIRES_IN || "1d" } // Default to '1d' if not set
  );
}
