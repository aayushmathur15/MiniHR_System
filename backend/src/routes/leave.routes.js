import { Router } from "express";
import {
    applyLeave,
    getMyLeaves,
    editLeave,
    cancelLeave,
    getAllLeaves,
    actionLeave,
} from "../controllers/leaveController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

// ─── Employee Routes ───────────────────────────────────────
router.route("/apply").post(verifyJWT, applyLeave);
router.route("/my").get(verifyJWT, getMyLeaves);
router.route("/:id/edit").patch(verifyJWT, editLeave);
router.route("/:id/cancel").delete(verifyJWT, cancelLeave);

// ─── Admin Routes ──────────────────────────────────────────
router.route("/all").get(verifyJWT, isAdmin, getAllLeaves);
router.route("/:id/action").patch(verifyJWT, isAdmin, actionLeave);

export default router;