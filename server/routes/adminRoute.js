import { Router } from "express";
import { requireUser, requireAdmin } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";
import prisma from "../model/prisma.js";
import multer from "multer";
import { fileUploader } from "../config/supabase.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

const fileChecker = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Invalid file type. Only images are allowed." });
    }
    next();
}
const adminRouter = Router();

const createTags = async (tags, postId) => {
    for (const tagName of tags) {
        let tag = await prisma.tag.findUnique({
            where: { name: tagName }
        });
        if (!tag) {
            tag = await prisma.tag.create({
                data: { name: tagName }
            });
        }
        await prisma.tag.update({
            where: { id: tag.id },
            data: {
                posts: {
                    connect: { id: postId }
                }
            }
        })
    }
};

const removeTags = async (tags, postId) => {
    for (const tagName of tags) {
        const tag = await prisma.tag.findUnique({
            where: { name: tagName }
        });
        if (tag) {
            await prisma.tag.update({
                where: { id: tag.id },
                data: {
                    posts: {
                        disconnect: { id: postId }
                    }
                }
            });
        }
    }
};

adminRouter.post("/secretCode", requireUser, [
    body("code").notEmpty().withMessage("Code is required")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { code } = req.body;
    const SECRET_ADMIN_CODE = process.env.SECRET_ADMIN_CODE || "default_secret_code";
    if (code === SECRET_ADMIN_CODE) {
        const id = req.user.id;
        try {
            await prisma.user.update({
                where: { id },
                data: { admin: true }
            });
            res.json({ message: "User promoted to admin successfully" });
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        return res.status(400).json({ message: "Invalid secret code" });
    }
});

adminRouter.get("/posts/:page", requireUser, requireAdmin, async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: req.user.id
            },
            skip,
            take: pageSize,
            include: {
                tags: true
            }
        });
        res.json({ posts });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRouter.get("/post/:id", requireUser, requireAdmin, async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
                authorId: req.user.id
            },
            include: {
                tags: true
            }
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json({ post });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRouter.delete("/post/:id", requireUser, requireAdmin, async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        await prisma.post.delete({
            where: {
                id: postId,
                authorId: req.user.id
            }
        });
        res.json({ message: "Post deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRouter.put("/post/:id/publish", requireUser, requireAdmin, async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await prisma.post.update({
            where: {
                id: postId,
                authorId: req.user.id
            },
            data: {
                published: true,
                publicationDate: new Date()
            }
        });
        res.json({ message: "Post published successfully", post });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRouter.put("/post/:id/unpublish", requireUser, requireAdmin, async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await prisma.post.update({
            where: {
                id: postId,
                authorId: req.user.id
            },
            data: {
                published: false,
                publicationDate: null
            }
        });
        res.json({ message: "Post unpublished successfully", post });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRouter.post("/posts", requireUser, requireAdmin, upload.single("bannerImg"), fileChecker, [
    body("title").notEmpty().withMessage("Title is required"),
    body("tags").isArray({
        max: 5
    }).withMessage("Tags must be an array")
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, content, tags } = req.body;
    try {
        const post = await prisma.post.create({
            data: {
                authorId: req.user.id,
                title,
                content,
                published: false,
                bannerImg: req.file ? await fileUploader(req.file) : ""
            }
        });
        if (tags && Array.isArray(tags)) {
            await createTags(tags, post.id);
        }
        res.status(201).json({ message: "Post created successfully", postId: post.id });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRouter.put("/post/:id", requireUser, requireAdmin, upload.single("bannerImg"), fileChecker, [
    body("title").notEmpty().withMessage("Title is required"),
    body("tags").isArray({
        max: 5
    }).withMessage("Tags must be an array")
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const postId = parseInt(req.params.id);
    const { title, content, tags } = req.body;
    try {
        const post = await prisma.post.update({
            where: {
                id: postId,
                authorId: req.user.id
            },
            data: {
                title,
                content,
                ...(req.file && { bannerImg: await fileUploader(req.file) })
            }
        });
        const existingTags = await prisma.tag.findMany({
            where: {
                posts: {
                    some: { id: postId }
                }
            }
        });
        const existingTagNames = existingTags.map(tag => tag.name);
        const newTagNames = tags || [];
        const tagsToAdd = newTagNames.filter(tag => !existingTagNames.includes(tag));
        const tagsToRemove = existingTagNames.filter(tag => !newTagNames.includes(tag));
        await createTags(tagsToAdd, postId);
        await removeTags(tagsToRemove, postId);
        res.json({ message: "Post updated successfully", post });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

adminRouter.post("/pictureUpload", requireUser, requireAdmin, upload.single("image"), fileChecker, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imageUrl = await fileUploader(req.file);
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default adminRouter;