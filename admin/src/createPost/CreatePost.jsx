import styles from './createPost.module.css';
import navStyles from '../adminDashboard/Admin/admin.module.css';
import Nav from '../adminDashboard/Admin/nav/Nav.jsx';
import ImageDropzone from './ImageDropzone/ImageDropzone.jsx';
import PostTitle from './PostTitle/PostTitle.jsx';
import Content from './Content/Content.jsx';

export default function CreatePost({ title = "", content = null, tags = [], bannerImg = '' }) {
    function handleImageChange(image) {
        console.log('Image changed:', image);
    }

    return (
        <div className={styles.createPostContainer}>
            <Nav styles={navStyles} />
            <h1 className={styles.title}>{title ? title : "Create Post"}</h1>
            <ImageDropzone initialImage={bannerImg} onImageChange={handleImageChange} />
            <PostTitle title={title} />
            <Content initialContent={content} />
        </div>
    );
}