import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminPost } from '../api.js';
import Nav from '../adminDashboard/Admin/nav/Nav.jsx';
import navStyles from '../adminDashboard/Admin/admin.module.css';
import styles from './viewPost.module.css';
import { useAuth } from '../provider/AuthProvider.jsx';

export default function ViewPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (postId) {
            loadPost();
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
