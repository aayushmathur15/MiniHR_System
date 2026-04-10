import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Employee reference is required"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
        },
        status: {
            type: String,
            enum: ["Present", "Absent"],
            required: [true, "Attendance status is required"],
        },
    },
    { timestamps: true }
);

// Compound unique index — one record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);