// api.js
import axios from "axios";

const API_BASE = "https://tanimatic-blog-project.onrender.com"; // Backend URL

// Axios instance without auth
const axiosPublic = axios.create({
    baseURL: API_BASE,
});

// Axios instance with auth - dynamically get token for each request
const axiosAuth = axios.create({
    baseURL: API_BASE,
});

// Add token to each authenticated request
axiosAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("Attaching token:", token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --------------------
// USER
// --------------------
export const signUp = async (userData) => {
    return axiosPublic.post("/users/sign-up", userData);
};

export const loginUser = async (userData) => {
    return axiosPublic.post("/users/login", userData);
};

export const getCurrentUser = async () => {
    return axiosAuth.get("/users/me");
};


// --------------------
// POSTS (PUBLIC)
// --------------------
export const getPublishedPosts = async (page = 1) => {
    return axiosPublic.get(`/posts/page/${page}`);
};

export const getSinglePost = async (id) => {
    return axiosPublic.get(`/posts/posts/${id}`);
};

// --------------------
// COMMENTS
// --------------------
export const getComments = async (postId, page = 1) => {
    return axiosPublic.get(`/comments/${postId}/${page}`);
};

export const createComment = async (postId, content) => {
    return axiosAuth.post(`/comments/${postId}`, { content });
};

export const updateComment = async (commentId, content) => {
    return axiosAuth.put(`/comments/comment/${commentId}`, { content });
};

export const deleteComment = async (commentId) => {
    return axiosAuth.delete(`/comments/comment/${commentId}`);
};

// --------------------
// ADMIN
// --------------------
export const submitAdminCode = async (code) => {
    return axiosAuth.post("/admin/secretCode", { code });
};

export const getAdminPosts = async (page = 1) => {
    return axiosAuth.get(`/admin/posts/${page}`);
};

export const getAdminPost = async (id) => {
    return axiosAuth.get(`/admin/post/${id}`);
};

export const createPost = async ({ title, content, tags = [], bannerImg }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    tags.forEach((tag) => formData.append("tags[]", tag));
    if (tags.length < 1) {
        formData.append("tags[]", "");
    }
    if (bannerImg) formData.append("bannerImg", bannerImg);

    return axiosAuth.post("/admin/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const updatePost = async (id, { title, content, tags = [], bannerImg }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    tags.forEach((tag) => formData.append("tags[]", tag));
    if (bannerImg) formData.append("bannerImg", bannerImg);

    return axiosAuth.put(`/admin/post/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deletePost = async (id) => {
    return axiosAuth.delete(`/admin/post/${id}`);
};

export const publishPost = async (id) => {
    return axiosAuth.put(`/admin/post/${id}/publish`);
};

export const unpublishPost = async (id) => {
    return axiosAuth.put(`/admin/post/${id}/unpublish`);
};

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return axiosAuth.post("/admin/pictureUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
