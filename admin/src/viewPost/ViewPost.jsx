import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminPost, getComments, deleteComment } from '../api.js';
import Nav from '../adminDashboard/Admin/nav/Nav.jsx';
import navStyles from '../adminDashboard/Admin/admin.module.css';
import styles from './viewPost.module.css';
import { useAuth } from '../provider/AuthProvider.jsx';

export default function ViewPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsPage, setCommentsPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);

    useEffect(() => {
        if (postId) {
            loadPost();
            loadComments();
        }
    }, [postId]);

    async function loadPost() {
        setLoading(true);
        try {
            const response = await getAdminPost(postId);
            console.log("Fetched post for viewing:", response);
            if (response.status === 200) {
                setPost(response.data.post);
            }
        } catch (error) {
            console.error("Error loading post:", error);
            if (error.response?.status === 404) {
                navigate('/404');
            } else if (error.response?.status === 401) {
                navigate('/401');
            } else {
                alert("Failed to load post");
                navigate('/admin');
            }
        } finally {
            setLoading(false);
        }
    }

    async function loadComments() {
        setCommentsLoading(true);
        try {
            const response = await getComments(postId, commentsPage);
            console.log("Fetched comments:", response);
            if (response.status === 200) {
                setComments(response.data.comments || []);
                setHasMoreComments(response.data.comments?.length >= 10);
            }
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setCommentsLoading(false);
        }
    }

    async function handleDeleteComment(commentId) {
        if (confirm("Are you sure you want to delete this comment?")) {
            try {
                const response = await deleteComment(commentId);
                if (response.status === 200) {
                    alert("Comment deleted successfully");
                    loadComments(); // Reload comments
                }
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert("Failed to delete comment");
            }
        }
    }

    function handleNextPage() {
        setCommentsPage(prev => prev + 1);
        loadComments();
    }

    function handlePrevPage() {
        setCommentsPage(prev => Math.max(1, prev - 1));
        loadComments();
    }

    if (loading) {
        return (
            <div className={styles.viewPostContainer}>
                <Nav styles={navStyles} username={user?.username || 'Admin'} />
                <div className={styles.loading}>Loading post...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.viewPostContainer}>
                <Nav styles={navStyles} username={user?.username || 'Admin'} />
                <div className={styles.error}>Post not found</div>
            </div>
        );
    }

    // Extract tag names from tag objects
    const tagNames = post.tags?.map(tag =>
        typeof tag === 'string' ? tag : tag?.name || ''
    ).filter(tag => tag) || [];

    return (
        <div className={styles.viewPostContainer}>
            <Nav styles={navStyles} username={user?.username || 'Admin'} />

            <div className={styles.postContent}>
                {post.bannerImg && (
                    <div className={styles.bannerImageContainer}>
                        <img
                            src={post.bannerImg}
                            alt={post.title}
                            className={styles.bannerImage}
                        />
                    </div>
                )}

                <h1 className={styles.title}>{post.title}</h1>

                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {tagNames.length > 0 && (
                    <div className={styles.tagsContainer}>
                        <p className={styles.tagsLabel}>Tags:</p>
                        <div className={styles.tags}>
                            {tagNames.map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.commentsSection}>
                    <h2 className={styles.commentsTitle}>Comments ({comments.length})</h2>

                    {commentsLoading ? (
                        <div className={styles.commentsLoading}>Loading comments...</div>
                    ) : comments.length === 0 ? (
                        <div className={styles.noComments}>No comments yet.</div>
                    ) : (
                        <div className={styles.commentsList}>
                            {comments.map((comment) => (
                                <div key={comment.id} className={styles.comment}>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.commentAuthor}>
                                            {comment.author?.username || 'Anonymous'}
                                        </span>
                                        <span className={styles.commentDate}>
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={styles.commentContent}>{comment.content}</p>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className={styles.deleteCommentBtn}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {comments.length > 0 && (
                        <div className={styles.commentsPagination}>
                            <button
                                onClick={handlePrevPage}
                                disabled={commentsPage === 1 || commentsLoading}
                                className={styles.paginationBtn}
                            >
                                Previous
                            </button>
                            <span className={styles.pageNumber}>Page {commentsPage}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={!hasMoreComments || commentsLoading}
                                className={styles.paginationBtn}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <button
                        onClick={() => navigate('/admin')}
                        className={styles.backButton}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={() => navigate(`/create-post/${post.id}`)}
                        className={styles.editButton}
                    >
                        Edit Post
                    </button>
                </div>
            </div>
        </div>
    );
}
