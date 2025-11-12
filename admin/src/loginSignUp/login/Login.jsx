export default function Login({ styles, errors }) {

    return (
        <div className={styles.formBox}>
            <label>Username</label>
            <input type="text" placeholder="Enter your username" />
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
            <button>Login</button>
        </div>
    );
}