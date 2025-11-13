import { createContext, useState, useContext, use } from 'react';
import { loginUser, signUp as signUpRoute, getCurrentUser } from '../api.js';
import { useEffect } from 'react';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getCurrentUserInfo();
        } else {
            setLoading(false);
        }
    }, []);

    async function login(userData) {
        try {
            const response = await loginUser(userData);
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                setIsAuthenticated(true);
                setUser(response.data.user);
                setIsAdmin(response.data.user.admin || false);
                return true;
            } else if (response.status === 400) {
                alert("Login failed. Please check your credentials.");
                return false;
            } else if (response.status === 500) {
                alert("Server error. Please try again later.");
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
            return false;
        }
    }

    async function signUp(userData) {
        try {
            const response = await signUpRoute(userData);
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                setIsAuthenticated(true);
                setUser(response.data.user);
                setIsAdmin(response.data.user.admin || false);
                return true;
            } else if (response.status === 400) {
                alert("Sign up failed. Please check your input.");
                return false;
            } else if (response.status === 500) {
                alert("Server error. Please try again later.");
                return false;
            }
        } catch (error) {
            console.error("Sign up error:", error);
            alert("Sign up failed. Please try again.");
            return false;
        }
    }

    async function getCurrentUserInfo() {
        try {
            const response = await getCurrentUser();
            if (response.status === 200) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                setIsAdmin(response.data.user.admin || false);
                setLoading(false);
                return true;
            } else if (response.status === 401) {
                // Only clear auth on 401 (unauthorized)
                console.log("Token expired or invalid (401)");
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Get current user error:", error);
            // Only clear auth if it's a 401 error, not network errors
            if (error.response?.status === 401) {
                console.log("Token expired or invalid (401 in catch)");
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                setUser(null);
                setIsAdmin(false);
            } else {
                // For network errors, keep the user logged in
                console.log("Network error, keeping user logged in");
            }
            setLoading(false);
            return false;
        }
    }

    function logout() {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
    }

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signUp, logout, isAdmin, getCurrentUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}