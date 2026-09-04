import React, { createContext, useState, useEffect } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Al recargar la página, revisamos si hay una sesión guardada
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = async (usuario, password) => {
        const data = await api.login(usuario, password);
        // Guardamos el token y los datos del usuario en el navegador
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const handleLogout = () => {
        // Borramos todo al cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};