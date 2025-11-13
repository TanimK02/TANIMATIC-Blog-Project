import { useState, useRef } from 'react';
import styles from './imageDropzone.module.css';

export default function ImageDropzone({ initialImage = '', onImageChange }) {
    const [uploadedImage, setUploadedImage] = useState(initialImage);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                if (onImageChange) {
                    onImageChange(file); // Pass the File object, not base64
                }
            };
            reader.readAsDataURL(file);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0] && files[0].type.startsWith('image/')) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                if (onImageChange) {
                    onImageChange(file); // Pass the File object, not base64
                }
            };
            reader.readAsDataURL(file);
        }
    }

    function handleClick() {
        fileInputRef.current?.click();
    }

    return (
        <div>
            <p className={styles.bannerImgLabel}>Banner Image</p>
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`${styles.bannerImgDropzone} ${isDragging ? styles.dragging : ''} ${uploadedImage ? styles.hasImage : ''}`}
                style={{
                    cursor: 'pointer',
                    backgroundImage: uploadedImage ? `url(${uploadedImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className={styles.bannerImgInput}
                    hidden
                />
                {uploadedImage ? (
                    <div className={styles.imageOverlay}>
                        <p>Click to change image or Drag and Drop</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.uploadIcon}></div>
                        <p>Drag & Drop Image Here or Click to Upload</p>
                    </>
                )}
            </div>
        </div>
    );
}
