import { useNavigate } from 'react-router-dom';
import styles from './errorPages.module.css';

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <h1 className={styles.errorCode}>401</h1>
                <h2 className={styles.errorTitle}>Unauthorized</h2>
                <p className={styles.errorMessage}>
                    You don't have permission to access this resource.
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
