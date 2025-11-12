import { Router } from "express";
import { body, validationResult } from "express-validator";
import passport from "passport";
import bcrypt from "bcrypt";
import prisma from "../model/prisma.js";
import jwt from "jsonwebtoken";
import { requireUser } from "../middleware/auth.js";
const userRouter = Router();


userRouter.post("/sign-up", [
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email address")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        const payload = { id: newUser.id, username: newUser.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "default_secret_key", { expiresIn: '1 day' });
        res.status(201).json({ message: "User registered successfully", userId: newUser.id, token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

});
userRouter.post("/login", [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required")
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "default_secret_key", { expiresIn: '1 day' });
        res.json({ message: "User logged in successfully", userId: user.id, token });
    })(req, res, next);
});

userRouter.get("/me", requireUser, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, email: true, admin: true }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default userRouter;