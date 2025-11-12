import Login from "./login/Login.jsx";
import SignUp from "./signUp/SignUp.jsx";
import { useState } from "react";
import styles from './LoginSign.module.css';

function LoginSign() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className={styles.background}>
            <h1 className={styles.logo}>TANIMATIC</h1>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <h2>Welcome Back</h2>
                    <div className={styles.buttonGroup}>
                        <div className={isLogin ? `${styles.underline} ${styles.buttonContainer}` : styles.buttonContainer}>
                            <button onClick={() => setIsLogin(true)}>Login</button>
                        </div>
                        <div className={!isLogin ? `${styles.underline} ${styles.buttonContainer}` : styles.buttonContainer}>
                            <button onClick={() => setIsLogin(false)}>Sign Up</button>
                        </div>
                    </div>
                    {isLogin ? <Login styles={styles} /> : <SignUp styles={styles} />}
                </div>
            </div>
        </div>
    );
}

export default LoginSign;