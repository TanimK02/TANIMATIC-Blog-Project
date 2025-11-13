import styles from './admin.module.css';
import Nav from './nav/Nav.jsx';
import PostBox from './postBox/PostBox.jsx';
import { useState, useEffect } from 'react';
import { useAuth } from '../../provider/AuthProvider.jsx';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAdminPosts, deletePost, publishPost, unpublishPost } from '../../api.js';

export default function Admin() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            loadPosts();
        }
    }, [page, isAuthenticated, isAdmin]);

    async function loadPosts() {
        setLoading(true);
        try {
            console.log("Loading posts for page:", page);
            const response = await getAdminPosts(page);
            console.log("Posts response:", response);
            console.log("Posts data:", response.data);
            if (response.status === 200) {
                setPosts(response.data || []);
                setHasMore(response.data.length >= 10); // Assume 10 posts per page
            }
        } catch (error) {
            console.error("Error loading posts:", error);
            console.error("Error response:", error.response?.data);
            alert("Failed to load posts");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                const response = await deletePost(id);
                if (response.status === 200) {
                    alert("Post deleted successfully");
                    loadPosts(); // Reload posts
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Failed to delete post");
            }
        }
    }

    async function handleTogglePublish(id, isPublished) {
        try {
            const response = isPublished ? await unpublishPost(id) : await publishPost(id);
            if (response.status === 200) {
                alert(`Post ${isPublished ? 'unpublished' : 'published'} successfully`);
                loadPosts(); // Reload posts
            }
        } catch (error) {
            console.error("Error toggling publish status:", error);
            alert("Failed to update post status");
        }
    }

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }
    if (!isAdmin) {
        return <Navigate to="/access" replace={true} />;
    }

    return (
        <div className={styles.adminContainer}>
            <Nav styles={styles} username={user?.username || 'Admin'} />
            <h1 className={styles.blogPostsTitle}>Blog Posts</h1>
            <div className={styles.postsContainer}>
                <div className={styles.postBox}>
                    <p>TITLE</p>
                    <p>STATUS</p>
                    <p>LAST UPDATED</p>
                    <div>
                        ACTIONS
                    </div>
                </div>
                {loading ? (
                    <div className={styles.loading}>Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className={styles.noPosts}>No posts yet. Create your first post!</div>
                ) : (
                    posts.map((post) => (
                        <PostBox
                            key={post.id}
                            styles={styles}
                            title={post.title}
                            status={post.published ? "Published" : "Draft"}
                            updated={new Date(post.updatedAt).toLocaleDateString()}
                            id={post.id}
                            onDelete={() => handleDelete(post.id)}
                            onTogglePublish={() => handleTogglePublish(post.id, post.published)}
                        />
                    ))
                )}
            </div>

            <div className={styles.pagination}>
                <button className={styles.paginationButton} onClick={() => setPage(page - 1)} disabled={page === 1 || loading}> &lt; </button>
                <span> {page} </span>
                <button className={styles.paginationButton} onClick={() => setPage(page + 1)} disabled={!hasMore || loading}> &gt; </button>
            </div>

            <div className={styles.logOutContainer}>
                <div className={styles.logOutPic}></div>
                <button className={styles.logOutButton} onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}