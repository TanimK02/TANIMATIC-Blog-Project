export default function Nav({ styles }) {
    return (
        <>
            <nav className={styles.nav}>
                <h1>TANIMATIC</h1>
                <div className={styles.navRight}>
                    <button>Create Post</button>
                    <button>Dashboard</button>
                    <p>Admin Name</p>
                </div>
            </nav>

        </>
    );
}   