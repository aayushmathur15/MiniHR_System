import { Router } from "express";
import {
    markAttendance,
    getMyAttendance,
    getAllAttendance,
} from "../controllers/attendance.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

// ─── Employee Routes ───────────────────────────────────────
router.route("/mark").post(verifyJWT, markAttendance);
router.route("/my").get(verifyJWT, getMyAttendance);

// ─── Admin Routes ──────────────────────────────────────────
router.route("/all").get(verifyJWT, isAdmin, getAllAttendance);

export default router;