// src/providers/NotificationsProvider.tsx
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNotifications} from '@/src/hooks/useNotifications';
import type {RootState} from '@/src/types/store';

interface NotificationsProviderProps {
    children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({children}) => {
    const {token} = useSelector((state: RootState) => state.user);
    const {isRegistered} = useSelector((state: RootState) => state.notification);
    const {initializeNotifications} = useNotifications();

    // Watch for auth state changes
    useEffect(() => {
        if (token && !isRegistered) {
            console.log('Auth state changed, initializing notifications...');
            initializeNotifications().catch(error => {
                console.error('Failed to initialize notifications:', error);
            });
        }
    }, [token, isRegistered]);

    return <>{children}</>;
};