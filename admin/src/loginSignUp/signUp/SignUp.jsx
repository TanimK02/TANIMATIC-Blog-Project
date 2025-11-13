import { useAuth } from "../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp({ styles }) {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignUp() {
        setIsLoading(true);
        try {
            const success = await signUp({ email, username, password });
            if (success) {
                navigate("/admin", { replace: true });
            }
        } catch (error) {
            console.error("Sign up error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.formBox}>
            <label>Email</label>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
            />
            <label>Username</label>
            <input
                type="text"
                placeholder="Choose your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
            />
            <label>Password</label>
            <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                disabled={isLoading}
            />
            <button onClick={handleSignUp} disabled={isLoading}>
                {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
        </div>
    );
}