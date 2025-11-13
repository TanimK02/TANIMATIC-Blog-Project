import styles from './createPost.module.css';
import navStyles from '../adminDashboard/Admin/admin.module.css';
import Nav from '../adminDashboard/Admin/nav/Nav.jsx';
import ImageDropzone from './ImageDropzone/ImageDropzone.jsx';
import PostTitle from './PostTitle/PostTitle.jsx';
import Content from './Content/Content.jsx';
import Tags from './Tags/Tags.jsx';
import PublishToggle from './PublishToggle/PublishToggle.jsx';
import { useAuth } from '../provider/AuthProvider.jsx';
import { Navigate } from 'react-router-dom';
export default function CreatePost({ title = "", content = null, tags = [], bannerImg = '', published = false }) {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }
    if (!user.isAdmin) {
        return <Navigate to="/access" replace={true} />;
    }
    function handleImageChange(image) {
        console.log('Image changed:', image);
    }

    function handleTagsChange(tags) {
        console.log('Tags changed:', tags);
    }

    function handlePublishChange(isPublished) {
        console.log('Publish status changed:', isPublished);
    }

    return (
        <div className={styles.createPostContainer}>
            <Nav styles={navStyles} />
            <h1 className={styles.title}>{title ? title : "Create Post"}</h1>
            <ImageDropzone initialImage={bannerImg} onImageChange={handleImageChange} />
            <PostTitle title={title} />
            <Content initialContent={content} onContentChange={() => { }} />
            <Tags initialTags={tags} onTagsChange={handleTagsChange} />
            <PublishToggle initialPublished={published} onPublishChange={handlePublishChange} />
        </div>
    );
}