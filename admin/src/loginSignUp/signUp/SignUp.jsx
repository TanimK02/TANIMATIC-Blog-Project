import { useAuth } from "../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function SignUp({ styles }) {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className={styles.formBox}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Username</label>
            <input type="text" placeholder="Choose your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Password</label>
            <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => {
                const isSignedUp = signUp({ email, username, password });
                if (isSignedUp) {
                    navigate("/admin", { replace: true });
                }
            }}>Sign Up</button>
        </div>
    );
}   