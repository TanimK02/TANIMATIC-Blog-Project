import styles from './createPost.module.css';
import navStyles from '../adminDashboard/Admin/admin.module.css';
import Nav from '../adminDashboard/Admin/nav/Nav.jsx';
import ImageDropzone from './ImageDropzone/ImageDropzone.jsx';
import PostTitle from './PostTitle/PostTitle.jsx';
import Content from './Content/Content.jsx';
import Tags from './Tags/Tags.jsx';
import PublishToggle from './PublishToggle/PublishToggle.jsx';
import { useState, useCallback, useRef, useEffect } from 'react';
import { createPost, updatePost, publishPost, unpublishPost, getAdminPost } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export default function CreatePost({ initialTitle = "", initialContent = "", initialTags = [], initialBannerImg = '', initialPublished = false }) {
    const [title, setTitle] = useState(initialTitle);
    const contentRef = useRef(initialContent);
    const [tags, setTags] = useState(initialTags);
    const [bannerImg, setBannerImg] = useState(initialBannerImg);
    const [isPublished, setIsPublished] = useState(initialPublished);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadedContent, setLoadedContent] = useState(initialContent);
    const navigate = useNavigate();
    const postId = useParams().postId || null;

    useEffect(() => {
        if (postId) {
            setIsLoading(true);
            getAdminPost(postId).then((response) => {
                console.log("Fetched post data for editing:", response);
                if (response.status === 200) {
                    const post = response.data.post;
                    setTitle(post.title);
                    contentRef.current = post.content;
                    setLoadedContent(post.content); // Set loaded content for TinyMCE
                    setTags(post.tags || []);
                    setBannerImg(post.bannerImg || '');
                    setIsPublished(post.isPublished || false);
                }
            }).catch((error) => {
                console.error("Error fetching post data:", error);
                if (error.response?.status === 404) {
                    navigate('/404');
                } else if (error.response?.status === 401) {
                    navigate('/401');
                } else {
                    alert("Failed to load post data for editing.");
                    navigate('/admin');
                }
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [postId, navigate]);

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
            // Ensure tags are strings, not objects
            const tagStrings = tags.map(tag =>
                typeof tag === 'string' ? tag : tag?.name || ''
            ).filter(tag => tag);

            const postData = {
                title,
                content: contentRef.current,
                tags: tagStrings,
                bannerImg
            };

            console.log(postId ? "Updating post" : "Creating post", "with data:", {
                title,
                contentLength: contentRef.current?.length,
                tags: tagStrings,
                hasBannerImg: !!bannerImg
            });

            let response;
            if (postId) {
                // Update existing post
                response = await updatePost(postId, postData);
            } else {
                // Create new post
                response = await createPost(postData);
            }

            console.log("Post response:", response);

            if (response.status === 200 || response.status === 201) {
                const resultPostId = postId || response.data.postId;

                // Handle publish/unpublish
                if (isPublished) {
                    await publishPost(resultPostId);
                }
                else {
                    await unpublishPost(resultPostId);
                }

                alert(postId ? "Post updated successfully!" : "Post created successfully!");
                navigate(`/create-post/${resultPostId}`);
            }
        } catch (error) {
            console.error("Error saving post:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            alert(`Failed to save post: ${error.response?.data?.message || error.message}`);
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
                    disabled={isSaving || isLoading}
                >
                    {isSaving ? 'Saving...' : 'Save Post'}
                </button>
            </div>
            {isLoading ? (
                <div>Loading post data...</div>
            ) : (
                <>
                    <ImageDropzone initialImage={bannerImg} onImageChange={handleImageChange} />
                    <PostTitle title={title} onTitleChange={handleTitleChange} />
                    <Content initialContent={loadedContent} onContentChange={handleContentChange} />
                    <Tags initialTags={tags} onTagsChange={handleTagsChange} />
                    <PublishToggle initialPublished={isPublished} onPublishChange={handlePublishChange} />
                </>
            )}
        </div>
    );
}