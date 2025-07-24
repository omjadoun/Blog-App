import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const userData = await authService.getCurrentUser();
                if (userData && userData.$id) {
                    dispatch(login({ userData }));
                } else {
                    dispatch(logout());
                }
            } catch (err) {
                console.error("App :: useEffect :: error", err);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-2xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className='flex flex-col bg-gradient-to-b from-gray-800 via-gray-900 to-black'>
            <Header />
            <main className='flex-grow mt-4'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default App;
