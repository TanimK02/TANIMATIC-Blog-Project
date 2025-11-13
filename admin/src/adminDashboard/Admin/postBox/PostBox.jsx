import { useNavigate } from "react-router-dom";
export default function PostBox({
    styles,
    title,
    status,
    updated,
    id,
    onDelete,
}) {

    const navigate = useNavigate();

    function handleEdit() {
        navigate(`/create-post/${id}`);
    }

    function handleView() {
        navigate(`/view-post/${id}`);
    }

    return (
        <div className={styles.postBox}>
            <p>{title}</p>
            <p className={status === "Published" ? styles.published : styles.draft}>{status}</p>
            <p>{updated}</p>
            <div className={styles.postBoxButtons}>
                <button onClick={handleView} className={styles.viewButton}></button>
                <button onClick={handleEdit} className={styles.editButton}></button>
                <button onClick={onDelete} className={styles.deleteButton}></button>
            </div>
        </div>
    );
};