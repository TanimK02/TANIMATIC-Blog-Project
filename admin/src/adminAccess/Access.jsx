import styles from "./access.module.css";
import { useState } from "react";
export default function Access() {

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
                    <button>Submit</button>
                    {errors.msg && <p className={styles.error}>{errors.msg}</p>}
                    {success && <p className={styles.success}>Access Granted! Redirecting to Admin Dashboard...</p>}
                </div>
            </div>
        </div>
    );
}