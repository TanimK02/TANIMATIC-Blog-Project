import { createContext, useState, useContext } from 'react';
import { loginUser, signUp as signUpRoute, getCurrentUser } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({ admin: false });
    const [isAdmin, setIsAdmin] = useState(false);

    async function login(userData) {
        const response = await loginUser(userData);
        if (response.status === 200) {
            setIsAuthenticated(true);
            setUser(response.data.user);
            if (response.data.user.admin) {
                setIsAdmin(true);
            }
        } else if (response.status === 400) {
            alert("Login failed. Please check your credentials.");
        } else if (response.status === 500) {
            alert("Server error. Please try again later.");
        }
        return response.status === 200;
    }

    async function signUp(userData) {
        const response = await signUpRoute(userData);
        if (response.status === 200) {
            setIsAuthenticated(true);
            setUser(response.data.user);
            if (response.data.user.admin) {
                setIsAdmin(true);
            }
        } else if (response.status === 400) {
            alert("Sign up failed. Please check your input.");
        }
        else if (response.status === 500) {
            alert("Server error. Please try again later.");
        }
        return response.status === 200;
    }

    async function getCurrentUserInfo() {
        const response = await getCurrentUser();
        if (response.status === 200) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            if (response.data.user.admin) {
                setIsAdmin(true);
            }
        }
        else if (response.status === 401) {
            setIsAuthenticated(false);
            setUser({ admin: false });
            alert("Invalid or expired token. Please log in again.");
        }
        else if (response.status === 404) {
            alert("User not found.");
        }
        else if (response.status === 500) {
            alert("Server error. Please try again later.");
        }
        return response.status === 200;
    }

    function logout() {
        if (isAuthenticated) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser({ admin: false });
        }
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