import React, { createContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const startTime = Date.now();
        const minDisplayTime = 3000; // Tiempo mínimo en ms (3 segundos)
        let timer;

        // Observador en tiempo real de Firebase Authentication
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Si Firebase confirma que hay sesión, cargamos los datos de Sefirot
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } else {
                // Si la sesión de Firebase expiró o se cerró, limpiamos la app
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }

            // Calcular cuánto tiempo ha transcurrido
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            // Mantener el SplashScreen visible el tiempo mínimo configurado
            timer = setTimeout(() => {
                setLoading(false);
            }, remainingTime);
        });

        // Limpieza del observador y del timer al desmontar
        return () => {
            unsubscribe();
            if (timer) clearTimeout(timer);
        };
    }, []);

    const handleLogin = async (usuario, password) => {
        const data = await api.login(usuario, password);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth); // 1. Cierra sesión en el servidor de Firebase
        } catch (error) {
            console.error("Error al cerrar sesión en Firebase:", error);
        } finally {
            // 2. Limpia los datos locales
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};