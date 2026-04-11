import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


app.use(cors({
    origin: "https://literate-giggle-v6vrqjg967wrfvq7-5173.app.github.dev" || "https://mini-hr-system-topaz.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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