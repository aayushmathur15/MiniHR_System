import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Attendance } from "../models/attendance.model.js";

// ─── Helper: Get Today's Date (normalized) ─────────────────
const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// ─── Mark Attendance (Employee) ───────────────────────────
const markAttendance = asyncHandler(async (req, res) => {
    /*
    1. Get status from req.body
    2. Server sets date to today automatically
    3. Compound unique index handles duplicate marking
    4. Create attendance record
    */

    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Attendance status is required");
    }

    if (!["Present", "Absent"].includes(status)) {
        throw new ApiError(400, "Status must be either Present or Absent");
    }

    const today = getToday();

    // Try to create — compound index will reject duplicates
    try {
        const attendance = await Attendance.create({
            employee: req.user._id,
            date: today,
            status,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, attendance, "Attendance marked successfully"));

    } catch (error) {
        // MongoDB duplicate key error
        if (error.code === 11000) {
            throw new ApiError(400, "Attendance already marked for today");
        }
        throw error;
    }
});

// ─── Get My Attendance (Employee) ─────────────────────────
const getMyAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.find({ employee: req.user._id })
        .sort({ date: -1 }); // latest first

    return res
        .status(200)
        .json(new ApiResponse(200, attendance, "Attendance history fetched successfully"));
});

// ─── Get All Attendance (Admin) ────────────────────────────
const getAllAttendance = asyncHandler(async (req, res) => {
    /*
    Filters (all optional, work independently or together):
    - ?date=2025-05-01
    - ?employee=<userId>
    - ?date=2025-05-01&employee=<userId>
    */

    const { date, employee } = req.query;
    const filter = {};

    if (employee) {
        filter.employee = employee;
    }

    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        filter.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(filter)
        .populate("employee", "fullName email")
        .sort({ date: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, attendance, "Attendance records fetched successfully"));
});

export {
    markAttendance,
    getMyAttendance,
    getAllAttendance,
};