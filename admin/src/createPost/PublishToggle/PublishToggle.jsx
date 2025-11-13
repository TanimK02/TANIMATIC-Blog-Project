import { useState } from 'react';
import styles from './publishToggle.module.css';

export default function PublishToggle({ initialPublished = false, onPublishChange }) {
    const [isPublished, setIsPublished] = useState(initialPublished);

    function handleToggle() {
        const newValue = !isPublished;
        setIsPublished(newValue);
        if (onPublishChange) {
            onPublishChange(newValue);
        }
    }

    return (
        <div className={styles.publishContainer}>
            <label className={styles.toggleLabel}>
                <span className={styles.labelText}>
                    {isPublished ? 'Published' : 'Draft'}
                </span>
                <div className={styles.toggleSwitch}>
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={handleToggle}
                        className={styles.toggleInput}
                    />
                    <span className={styles.slider}></span>
                </div>
            </label>
        </div>
    );
}
