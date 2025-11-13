// Load environment variables from .env during app startup
import express from "express";
import passport from "passport";
import cors from "cors";
import "./config/passport.js";
import dotenv from 'dotenv';
dotenv.config();
import { userRouter, adminRouter, postsRouter, commentRouter } from "./routes/indexRoute.js";

const app = express();
const allowedOrigins = [
    "http://localhost:5173",  // or whatever your local dev port is
    "https://yourfrontend.onrender.com", // replace with your real frontend domain
];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentRouter);

app.keepAliveTimeout = 61 * 1000;
app.headersTimeout = 65 * 1000;

app.listen(10000, '0.0.0.0', () => {
    console.log("Server is running on http://localhost:10000/users/sign-up");
});