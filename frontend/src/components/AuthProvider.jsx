import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, signUp as signUpRoute, getCurrentUser } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            getCurrentUserInfo()
        } else {
            setLoading(false)
        }
    }, [])

    async function login(userData) {
        try {
            const res = await loginUser(userData)
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token)
                setUser(res.data.user)
                setIsAuthenticated(true)
                return true
            }
        } catch (e) {
            alert(e.response?.data?.message || 'Login failed')
            return false
        }
    }

    async function signUp(userData) {
        try {
            const res = await signUpRoute(userData)
            if (res.status === 201 || res.status === 200) {
                localStorage.setItem('token', res.data.token)
                setUser(res.data.user)
                setIsAuthenticated(true)
                return true
            }
        } catch (e) {
            const msg = e.response?.data?.error || e.response?.data?.message || 'Sign up failed'
            alert(msg)
            return false
        }
    }

    async function getCurrentUserInfo() {
        try {
            const res = await getCurrentUser()
            if (res.status === 200) {
                setUser(res.data)
                setIsAuthenticated(true)
            }
        } catch (e) {
            if (e.response?.status === 401) {
                localStorage.removeItem('token')
                setIsAuthenticated(false)
                setUser(null)
            }
        } finally {
            setLoading(false)
        }
    }

    function logout() {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        setUser(null)
    }

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
