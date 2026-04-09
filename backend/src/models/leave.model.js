import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Employee reference is required"],
        },
        leaveType: {
            type: String,
            enum: ["Casual", "Sick", "Paid"],
            required: [true, "Leave type is required"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        totalDays: {
            type: Number,
            required: [true, "Total days is required"],
            min: [1, "Total days must be at least 1"],
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        reason: {
            type: String,
            trim: true,
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        actionedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        actionedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);