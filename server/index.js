// Load environment variables from .env during app startup
import express from "express";
import passport from "passport";
import cors from "cors";
import "./config/passport.js";
import dotenv from 'dotenv';
dotenv.config();
import { userRouter, adminRouter, postsRouter, commentRouter } from "./routes/indexRoute.js";

const app = express();

app.use(cors({
    origin: "*", // or specific origins for production
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.set("trust proxy", 1);
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentRouter);

app.keepAliveTimeout = 61 * 1000;
app.headersTimeout = 65 * 1000;

app.listen(process.env.PORT || 10000, '0.0.0.0', () => {
    console.log("Server is running on http://localhost:10000/users/sign-up");
});