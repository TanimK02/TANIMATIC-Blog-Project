import styles from './createPost.module.css';
import navStyles from '../adminDashboard/Admin/admin.module.css';
import Nav from '../adminDashboard/Admin/nav/Nav.jsx';
import ImageDropzone from './ImageDropzone/ImageDropzone.jsx';
import PostTitle from './PostTitle/PostTitle.jsx';
import Content from './Content/Content.jsx';
import Tags from './Tags/Tags.jsx';
import PublishToggle from './PublishToggle/PublishToggle.jsx';
import { useState, useCallback, useRef, useEffect } from 'react';
import { createPost, publishPost, unpublishPost, getAdminPost } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export default function CreatePost({ initialTitle = "", initialContent = "", initialTags = [], initialBannerImg = '', initialPublished = false }) {
    const [title, setTitle] = useState(initialTitle);
    const contentRef = useRef(initialContent);
    const [tags, setTags] = useState(initialTags);
    const [bannerImg, setBannerImg] = useState(initialBannerImg);
    const [isPublished, setIsPublished] = useState(initialPublished);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const postId = useParams().postId || null;
    useEffect(() => {
        if (postId) {
            getAdminPost(postId).then((response) => {
                console.log("Fetched post data for editing:", response);
                if (response.status === 200) {
                    const post = response.data.post;
                    setTitle(post.title);
                    contentRef.current = post.content;
                    setTags(post.tags || []);
                    setBannerImg(post.bannerImg || '');
                    setIsPublished(post.isPublished || false);
                }
            }).catch((error) => {
                console.error("Error fetching post data:", error);
                alert("Failed to load post data for editing.");
            });
        }
    }, [postId]);

    const handleImageChange = useCallback((image) => {
        setBannerImg(image);
    }, []);

    const handleTitleChange = useCallback((newTitle) => {
        setTitle(newTitle);
    }, []);

    const handleContentChange = useCallback((newContent) => {
        contentRef.current = newContent;
    }, []);

    const handleTagsChange = useCallback((newTags) => {
        setTags(newTags);
    }, []);

    const handlePublishChange = useCallback((published) => {
        setIsPublished(published);
    }, []);

    async function handleSave() {
        if (!title.trim()) {
            alert("Please enter a title for your post");
            return;
        }

        if (!contentRef.current.trim()) {
            alert("Please add content to your post");
            return;
        }

        setIsSaving(true);
        try {
            const postData = {
                title,
                content: contentRef.current,
                tags,
                bannerImg
            };

            console.log("Creating post with data:", {
                title,
                contentLength: contentRef.current?.length,
                tagsCount: tags.length,
                hasBannerImg: !!bannerImg
            });

            const response = await createPost(postData);

            console.log("Create post response:", response);

            if (response.status === 201) {
                const newPostId = response.data.postId;

                // Handle publish/unpublish
                if (isPublished) {
                    await publishPost(newPostId);
                }

                alert("Post created successfully!");
                navigate('/admin');
            }
        } catch (error) {
            console.error("Error creating post:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            alert(`Failed to create post: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className={styles.createPostContainer}>
            <Nav styles={navStyles} />
            <div className={styles.header}>
                <h1 className={styles.title}>{postId ? "Edit Post" : "Create Post"}</h1>
                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Post'}
                </button>
            </div>
            <ImageDropzone initialImage={bannerImg} onImageChange={handleImageChange} />
            <PostTitle title={title} onTitleChange={handleTitleChange} />
            <Content initialContent={initialContent} onContentChange={handleContentChange} />
            <Tags initialTags={tags} onTagsChange={handleTagsChange} />
            <PublishToggle initialPublished={isPublished} onPublishChange={handlePublishChange} />
        </div>
    );
}