import { useNavigate } from 'react-router-dom';
import styles from './errorPages.module.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.errorTitle}>Page Not Found</h2>
                <p className={styles.errorMessage}>
                    The page you're looking for doesn't exist or has been removed.
                </p>
                <button
                    onClick={() => navigate('/admin')}
                    className={styles.errorButton}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}
