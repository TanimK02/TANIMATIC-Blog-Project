import styles from "./access.module.css";
import { useState } from "react";
import { useAuth } from '../provider/AuthProvider.jsx';
import { useNavigate, Navigate } from 'react-router-dom';
import { submitAdminCode } from "../api.js";

export default function Access() {
    const { isAuthenticated, isAdmin, getCurrentUserInfo } = useAuth();
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ msg: "" });
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }

    if (isAdmin) {
        return <Navigate to="/admin" replace={true} />;
    }

    async function handleSubmit() {
        setIsLoading(true);
        setErrors({ msg: "" });
        try {
            const response = await submitAdminCode(password);
            if (response.status === 200) {
                setSuccess(true);
                // Refresh user info to update admin status
                await getCurrentUserInfo();
                setTimeout(() => {
                    navigate("/admin", { replace: true });
                }, 1500);
            }
        } catch (error) {
            setErrors({ msg: "Invalid access code. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.accessContainer}>
            <div className={styles.accessBox}>
                <h1>Administrator Access</h1>
                <p>Please enter the administrator credentials.</p>
                <div className={styles.formBox}>
                    <label>Access Code</label>
                    <input
                        type="password"
                        placeholder="Enter access code"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        disabled={isLoading || success}
                    />
                    <button onClick={handleSubmit} disabled={isLoading || success}>
                        {isLoading ? 'Verifying...' : 'Submit'}
                    </button>
                    {errors.msg && <p className={styles.error}>{errors.msg}</p>}
                    {success && <p className={styles.success}>Access Granted! Redirecting to Admin Dashboard...</p>}
                </div>
            </div>
        </div>
    );
}