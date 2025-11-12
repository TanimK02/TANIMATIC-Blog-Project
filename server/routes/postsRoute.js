import { Router } from "express";
import prisma from "../model/prisma.js";
const postsRouter = Router();

postsRouter.get("/page/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    try {
        const posts = await prisma.post.findMany({
            skip,
            take: pageSize,
            where: { published: true },
            orderBy: { publicationDate: 'desc' },
            include: { tags: true }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

postsRouter.get("/posts/:id", async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId, published: true },
            include: { tags: true }
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default postsRouter;