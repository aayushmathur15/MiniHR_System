import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Leave } from "../models/leave.model.js";
import { User } from "../models/user.model.js";

// ─── Helper: Calculate Total Days ─────────────────────────
const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return totalDays;
};

// ─── Apply Leave (Employee) ────────────────────────────────
const applyLeave = asyncHandler(async (req, res) => {
    /*
    1. Get leaveType, startDate, endDate, reason from req.body
    2. Validate fields
    3. Ensure startDate is not in the past
    4. Ensure endDate is not before startDate
    5. Calculate totalDays
    6. Check if employee has enough leave balance
    7. Create leave request
    */

    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate) {
        throw new ApiError(400, "leaveType, startDate and endDate are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of day

    if (start < today) {
        throw new ApiError(400, "Leave cannot be applied for past dates");
    }

    if (end < start) {
        throw new ApiError(400, "End date cannot be before start date");
    }

    const totalDays = calculateTotalDays(start, end);

    const employee = await User.findById(req.user._id);
    if (employee.leaveBalance < totalDays) {
        throw new ApiError(400, `Insufficient leave balance. Available: ${employee.leaveBalance} days`);
    }

    const leave = await Leave.create({
        employee: req.user._id,
        leaveType,
        startDate: start,
        endDate: end,
        totalDays,
        reason: reason || "",
    });

    return res
        .status(201)
        .json(new ApiResponse(201, leave, "Leave applied successfully"));
});

// ─── Get My Leaves (Employee) ──────────────────────────────
const getMyLeaves = asyncHandler(async (req, res) => {
    const leaves = await Leave.find({ employee: req.user._id })
        .populate("actionedBy", "fullName email")
        .sort({ appliedDate: -1 }); // latest first

    return res
        .status(200)
        .json(new ApiResponse(200, leaves, "Leave history fetched successfully"));
});

// ─── Edit Leave (Employee) ─────────────────────────────────
const editLeave = asyncHandler(async (req, res) => {
    /*
    1. Find leave by id
    2. Ensure it belongs to the requesting employee
    3. Ensure status is still "Pending"
    4. Validate new dates
    5. Recalculate totalDays
    6. Update
    */

    const { leaveType, startDate, endDate, reason } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
        throw new ApiError(404, "Leave request not found");
    }

    if (leave.employee.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this leave request");
    }

    if (leave.status !== "Pending") {
        throw new ApiError(400, "Only pending leave requests can be edited");
    }

    const start = new Date(startDate || leave.startDate);
    const end = new Date(endDate || leave.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
        throw new ApiError(400, "Leave cannot be applied for past dates");
    }

    if (end < start) {
        throw new ApiError(400, "End date cannot be before start date");
    }

    const totalDays = calculateTotalDays(start, end);

    leave.leaveType = leaveType || leave.leaveType;
    leave.startDate = start;
    leave.endDate = end;
    leave.totalDays = totalDays;
    leave.reason = reason || leave.reason;

    await leave.save();

    return res
        .status(200)
        .json(new ApiResponse(200, leave, "Leave request updated successfully"));
});

// ─── Cancel Leave (Employee) ───────────────────────────────
const cancelLeave = asyncHandler(async (req, res) => {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
        throw new ApiError(404, "Leave request not found");
    }

    if (leave.employee.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to cancel this leave request");
    }

    if (leave.status !== "Pending") {
        throw new ApiError(400, "Only pending leave requests can be cancelled");
    }

    await Leave.findByIdAndDelete(req.params.id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Leave request cancelled successfully"));
});

// ─── Get All Leaves (Admin) ────────────────────────────────
const getAllLeaves = asyncHandler(async (req, res) => {
    const leaves = await Leave.find()
        .populate("employee", "fullName email leaveBalance")
        .populate("actionedBy", "fullName email")
        .sort({ appliedDate: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, leaves, "All leave requests fetched successfully"));
});

// ─── Approve or Reject Leave (Admin) ──────────────────────
const actionLeave = asyncHandler(async (req, res) => {
    /*
    1. Find leave by id
    2. Ensure status is "Pending"
    3. If Approved — deduct totalDays from employee's leaveBalance
    4. Set actionedBy and actionedAt
    5. Update status
    */

    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
        throw new ApiError(400, "Status must be either Approved or Rejected");
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
        throw new ApiError(404, "Leave request not found");
    }

    if (leave.status !== "Pending") {
        throw new ApiError(400, "Only pending leave requests can be actioned");
    }

    if (status === "Approved") {
        const employee = await User.findById(leave.employee);

        if (employee.leaveBalance < leave.totalDays) {
            throw new ApiError(400, `Insufficient leave balance. Employee has ${employee.leaveBalance} days remaining`);
        }

        // Deduct leave balance
        await User.findByIdAndUpdate(leave.employee, {
            $inc: { leaveBalance: -leave.totalDays },
        });
    }

    leave.status = status;
    leave.actionedBy = req.user._id;
    leave.actionedAt = new Date();

    await leave.save();

    return res
        .status(200)
        .json(new ApiResponse(200, leave, `Leave request ${status.toLowerCase()} successfully`));
});

export {
    applyLeave,
    getMyLeaves,
    editLeave,
    cancelLeave,
    getAllLeaves,
    actionLeave,
};