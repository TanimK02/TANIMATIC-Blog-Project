import styles from './postTitle.module.css';
import { useState } from 'react';
export default function PostTitle({ title }) {
    const [inputTitle, setInputTitle] = useState(title || "");
    return (
        <>
            <p className={styles.label}>Post Title:</p>
            <input type="text" placeholder="Enter Your Post Title Here" className={styles.titleInput} value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />
        </>
    );
}