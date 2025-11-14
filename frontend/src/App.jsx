import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthProvider.jsx'
import PostsList from './pages/PostsList.jsx'
import PostDetail from './pages/PostDetail.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'

function Header() {
    const { isAuthenticated, user, logout } = useAuth()
    return (
        <header>
            <nav>
                <Link to="/">Blog</Link>
            </nav>
            <div className="row">
                {isAuthenticated ? (
                    <>
                        <span style={{ marginRight: 10 }}>Hi, {user?.username}</span>
                        <button className="btn" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn">Login</Link>
                        <Link to="/signup" className="btn primary">Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<PostsList />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </AuthProvider>
    )
}
