import styles from './postTitle.module.css';
import { useState } from 'react';
export default function PostTitle({ title, onTitleChange }) {
    const [inputTitle, setInputTitle] = useState(title || "");

    function handleChange(e) {
        const newTitle = e.target.value;
        setInputTitle(newTitle);
        if (onTitleChange) {
            onTitleChange(newTitle);
        }
    }

    return (
        <>
            <p className={styles.label}>Post Title:</p>
            <input
                type="text"
                placeholder="Enter Your Post Title Here"
                className={styles.titleInput}
                value={inputTitle}
                onChange={handleChange}
            />
        </>
    );
}