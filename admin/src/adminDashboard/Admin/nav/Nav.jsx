import { useNavigate } from 'react-router-dom';

export default function Nav({ styles, username }) {
    const navigate = useNavigate();

    return (
        <>
            <nav className={styles.nav}>
                <h1>TANIMATIC</h1>
                <div className={styles.navRight}>
                    <button onClick={() => navigate('/create-post')}>Create Post</button>
                    <button onClick={() => navigate('/admin')}>Dashboard</button>
                    <p>{username}</p>
                </div>
            </nav>

        </>
    );
}   