import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// ─── Middlewares ───────────────────────────────────────────
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js'
import leaveRoutes from "./routes/leave.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";


//routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/leave", leaveRoutes);
app.use("/api/v1/attendance", attendanceRoutes);

export { app };