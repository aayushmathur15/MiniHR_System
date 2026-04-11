import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    getAllEmployees,
    getEmployeeById,

} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

// Public Routes 
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected Routes 
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);

// Admin Routes 
router.route("/employees").get(verifyJWT, isAdmin, getAllEmployees);
router.route("/employees/:id").get(verifyJWT, isAdmin, getEmployeeById);

export default router;