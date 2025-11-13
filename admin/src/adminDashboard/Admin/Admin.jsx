import styles from './admin.module.css';
import Nav from './nav/Nav.jsx';
import PostBox from './postBox/PostBox.jsx';
import { useState } from 'react';
import { useAuth } from '../../provider/AuthProvider.jsx';
import { Navigate } from 'react-router-dom';
export default function Admin() {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }
    if (!isAdmin) {
        return <Navigate to="/access" replace={true} />;
    }

    const [page, setPage] = useState(1);
    return (
        <div className={styles.adminContainer}>
            <Nav styles={styles} />
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
                <PostBox styles={styles} title="First Blog Post" status="Published" updated="2024-06-01" id={1} />
                <PostBox styles={styles} title="Second Blog Post" status="Draft" updated="2024-06-05" id={2} />
                <PostBox styles={styles} title="Third Blog Post" status="Published" updated="2024-06-10" id={3} />
            </div>

            <div className={styles.pagination}>
                <button className={styles.paginationButton} onClick={() => setPage(page - 1)} disabled={page === 1}> &lt; </button>
                <span> {page} </span>
                <button className={styles.paginationButton} onClick={() => setPage(page + 1)}> &gt; </button>
            </div>

            <div className={styles.logOutContainer}>
                <div className={styles.logOutPic}></div>
                <button className={styles.logOutButton}>Log Out</button>
            </div>
        </div>
    );
}