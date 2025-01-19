//authRoutes.js
import express from "express";
import { registerUser, loginUser, forgetpassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/resetpassword", forgetpassword);

export default router;
