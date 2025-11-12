// Load environment variables from .env during app startup
import express from "express";
import passport from "passport";
import path from "path";
import "./config/passport.js";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();
import { userRouter, adminRouter, postsRouter, commentRouter } from "./routes/indexRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentRouter);

app.keepAliveTimeout = 61 * 1000;
app.headersTimeout = 65 * 1000;

app.listen(10000, 'localhost', () => {
    console.log("Server is running on http://localhost:10000/users/sign-up");
});