import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? 'https://namsterbackend-3.onrender.com/api'
        : 'http://localhost:3001/api');

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/user/profile`);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const bootstrapAuth = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const storedUser = localStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));

                try {
                    const res = await axios.get(`${API_URL}/user/profile`);
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch {
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };

        bootstrapAuth();
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    const register = async (userData) => {
        const res = await axios.post(`${API_URL}/auth/register`, userData);
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    const googleLogin = async (googleToken) => {
        const res = await axios.post(`${API_URL}/auth/google`, { accessToken: googleToken });
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
