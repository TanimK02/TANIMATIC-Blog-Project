import styles from "./access.module.css";
import { useState } from "react";
import { useAuth } from '../provider/AuthProvider.jsx';
import { useNavigate, Navigate } from 'react-router-dom';
export default function Access() {
    const { isAuthenticated, authorizeAdmin, user } = useAuth();
    const navigate = useNavigate();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }
    if (user && user.isAdmin) {
        return <Navigate to="/admin" replace={true} />;
    } else {

        const [errors, setErrors] = useState({ msg: "" });
        const [success, setSuccess] = useState(false);
        return (
            <div className={styles.accessContainer}>
                <div className={styles.accessBox}>
                    <h1>Administrator Access</h1>
                    <p>Please enter the administrator credentials.</p>
                    <div className={styles.formBox}>
                        <label>Access Code</label>
                        <input type="password" placeholder="Enter access code" />
                        <button onClick={() => {
                            if (true) {
                                authorizeAdmin();
                                setSuccess(true);
                                navigate("/admin");
                            } else {
                                setErrors({ msg: "Invalid access code." });
                            }
                        }}>Submit</button>
                        {errors.msg && <p className={styles.error}>{errors.msg}</p>}
                        {success && <p className={styles.success}>Access Granted! Redirecting to Admin Dashboard...</p>}
                    </div>
                </div>
            </div>
        );
    }
}   