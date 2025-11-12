
export default function PostBox({ styles, title, status, updated, id }) {
    return (
        <div className={styles.postBox}>
            <p>{title}</p>
            <p className={status === "Published" ? styles.published : styles.draft}>{status}</p>
            <p>{updated}</p>
            <div className={styles.postBoxButtons}>
                <button className={styles.viewButton} ></button>
                <button className={styles.editButton}></button>
                <button className={styles.deleteButton}></button>
            </div>
        </div>
    );
};