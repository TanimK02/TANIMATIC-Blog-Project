import { Router } from "express";
import prisma from "../model/prisma.js";
import { body, validationResult } from "express-validator";
import { requireUser } from "../middleware/auth.js";
const commentRouter = Router();

commentRouter.get("/:postId/:commentPage", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const commentPage = parseInt(req.params.commentPage);
    const pageSize = 10;
    const skip = (commentPage - 1) * pageSize;
    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId
            },
            skip,
            take: pageSize,
            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }
        })
        res.json({ comments })
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

commentRouter.post("/:postId", requireUser, [
    body("content").notEmpty().withMessage("Content is required"),
], async (req, res) => {
    const postId = parseInt(req.params.postId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { content } = req.body;
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: req.user.id
            }
        });
        res.json({ comment });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

commentRouter.put("/comment/:commentId", requireUser, [
    body("content").notEmpty().withMessage("Content is required"),
], async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { content } = req.body;

    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        else if (comment.authorId !== req.user.id) {
            return res.status(403).json({
                error: "Not allowed to edit comment"
            })
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }

    try {
        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                content
            }
        });
        res.json({ updatedComment });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

commentRouter.delete("/comment/:commentId", requireUser, async (req, res) => {
    const commentId = parseInt(req.params.commentId);

    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        })
        console.log(`[comments] delete request by userId=${req.user?.id} admin=${req.user?.admin} for commentId=${commentId}`);
        console.log('[comments] comment found:', comment);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        else if (comment.authorId !== req.user.id && !req.user.admin) {
            console.log(`[comments] delete forbidden: requester=${req.user.id} authorId=${comment.authorId} admin=${req.user.admin}`);
            return res.status(403).json({
                error: "Not allowed to delete comment"
            })
        }
    }
    catch (err) {
        console.error('[comments] error during delete check:', err);
        return res.status(500).json({ error: "Internal server error" });
    }

    try {
        await prisma.comment.delete({
            where: {
                id: commentId
            }
        });
        console.log(`[comments] comment ${commentId} deleted by user=${req.user?.id}`);
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error('[comments] error deleting comment:', error);
        res.status(500).json({ error: "Internal server error" });
    }

});
export default commentRouter;