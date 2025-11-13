import { useAuth } from "../../provider/AuthProvider.jsx";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export default function Login({ styles }) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin() {
        setIsLoading(true);
        try {
            const success = await login({ username, password });
            if (success) {
                navigate("/admin", { replace: true });
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.formBox}>
            <label>Username</label>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
            />
            <label>Password</label>
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
            />
            <button onClick={handleLogin} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </div>
    );
}