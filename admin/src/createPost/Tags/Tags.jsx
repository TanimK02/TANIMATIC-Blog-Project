import { useState } from 'react';
import styles from './tags.module.css';

export default function Tags({ initialTags = [], onTagsChange }) {
    const [tags, setTags] = useState(initialTags);
    const [inputValue, setInputValue] = useState('');

    function handleKeyDown(e) {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();

            if (tags.length >= 5) {
                alert('Maximum 5 tags allowed');
                return;
            }

            const newTag = inputValue.trim();
            if (!tags.includes(newTag)) {
                const updatedTags = [...tags, newTag];
                setTags(updatedTags);
                if (onTagsChange) {
                    onTagsChange(updatedTags);
                }
            }
            setInputValue('');
        }
    }

    function removeTag(tagToRemove) {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        if (onTagsChange) {
            onTagsChange(updatedTags);
        }
    }

    return (
        <div className={styles.tagsContainer}>
            <p className={styles.label}>Tags (Max 5):</p>
            <div className={styles.tagsWrapper}>
                {tags.length > 0 && (
                    <div className={styles.tagsDisplay}>
                        {tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className={styles.removeBtn}
                                    aria-label="Remove tag"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <input
                    type="text"
                    placeholder={tags.length < 5 ? "Type a tag and press Enter" : "Maximum tags reached"}
                    className={styles.tagInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={tags.length >= 5}
                />
            </div>
            <p className={styles.hint}>{tags.length}/5 tags</p>
        </div>
    );
}
