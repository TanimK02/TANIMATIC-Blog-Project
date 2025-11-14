import axios from 'axios'

const API_BASE = 'https://tanimatic-blog-project.onrender.com'

const axiosPublic = axios.create({ baseURL: API_BASE })
const axiosAuth = axios.create({ baseURL: API_BASE })

axiosAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Users
export const signUp = (userData) => axiosPublic.post('/users/sign-up', userData)
export const loginUser = (userData) => axiosPublic.post('/users/login', userData)
export const getCurrentUser = () => axiosAuth.get('/users/me')

// Posts - public
export const getPublishedPosts = (page = 1) => axiosPublic.get(`/posts/page/${page}`)
export const getSinglePost = (id) => axiosPublic.get(`/posts/posts/${id}`)

// Comments
export const getComments = (postId, page = 1) => axiosPublic.get(`/comments/${postId}/${page}`)
export const createComment = (postId, content) => axiosAuth.post(`/comments/${postId}`, { content })
export const updateComment = (commentId, content) => axiosAuth.put(`/comments/${commentId}`, { content })
export const deleteComment = (commentId) => axiosAuth.delete(`/comments/${commentId}`)
