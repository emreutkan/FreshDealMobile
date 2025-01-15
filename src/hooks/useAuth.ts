// src/hooks/useAuth.ts
import {useEffect} from 'react';

import {tokenService} from '@/src/services/tokenService';
import {logout, setToken} from '@/src/redux/slices/userSlice';
import {useDispatch} from "react-redux";
import {AppDispatch, RootState, store} from "@/src/redux/store";

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const token = (store.getState() as RootState).user.token;
    const isInitialized = (store.getState() as RootState).user.isInitialized;
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedToken = await tokenService.getToken();
                if (storedToken) {
                    dispatch(setToken(storedToken));
                } else {
                    dispatch(logout());
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                dispatch(logout());
            }
        };

        checkAuth();
    }, [dispatch]);

    return {isAuthenticated: !!token, isInitialized};
};