// api.js
import axios from "axios";

const API_BASE = "https://tanimatic-blog-project.onrender.com"; // change to your backend URL

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Axios instance with auth
const axiosAuth = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${getToken()}` },
});

// --------------------
// USER
// --------------------
export const signUp = async (userData) => {
    return axios.post(`${API_BASE}/users/sign-up`, userData);
};

export const loginUser = async (userData) => {
    alert("API.js loginUser called");
    return axios.post(`${API_BASE}/users/login`, userData);
};

export const getCurrentUser = async () => {
    return axiosAuth.get("/users/me");
};


// --------------------
// POSTS (PUBLIC)
// --------------------
export const getPublishedPosts = async (page = 1) => {
    return axios.get(`${API_BASE}/posts/page/${page}`);
};

export const getSinglePost = async (id) => {
    return axios.get(`${API_BASE}/posts/posts/${id}`);
};

// --------------------
// COMMENTS
// --------------------
export const getComments = async (postId, page = 1) => {
    return axios.get(`${API_BASE}/comments/${postId}/${page}`);
};

export const createComment = async (postId, content) => {
    return axiosAuth.post(`/comments/${postId}`, { content });
};

export const updateComment = async (commentId, content) => {
    return axiosAuth.put(`/comments/${commentId}`, { content });
};

export const deleteComment = async (commentId) => {
    return axiosAuth.delete(`/comments/${commentId}`);
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
    return axiosAuth.get(`/admin/posts/${id}`);
};

export const createPost = async ({ title, content, tags = [], bannerImg }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    tags.forEach((tag) => formData.append("tags[]", tag));
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

    return axiosAuth.put(`/admin/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deletePost = async (id) => {
    return axiosAuth.delete(`/admin/posts/${id}`);
};

export const publishPost = async (id) => {
    return axiosAuth.put(`/admin/posts/${id}/publish`);
};

export const unpublishPost = async (id) => {
    return axiosAuth.put(`/admin/posts/${id}/unpublish`);
};

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return axiosAuth.post("/admin/pictureUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
