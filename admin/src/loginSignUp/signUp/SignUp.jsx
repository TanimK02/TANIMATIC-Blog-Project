export default function SignUp({ styles }) {
    return (
        <div className={styles.formBox}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
            <label>Username</label>
            <input type="text" placeholder="Choose your username" />
            <label>Password</label>
            <input type="password" placeholder="Create a password" />
            <button>Sign Up</button>
        </div>
    );
}   