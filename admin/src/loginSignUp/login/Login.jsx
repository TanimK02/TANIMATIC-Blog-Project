import { useAuth } from "../../provider/AuthProvider.jsx";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
export default function Login({ styles }) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className={styles.formBox}>
            <label>Username</label>
            <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => {
                const isLoggedIn = login({ username, password });
                if (isLoggedIn) {
                    navigate("/admin", { replace: true });
                }
            }}>Login</button>
        </div>
    );
}