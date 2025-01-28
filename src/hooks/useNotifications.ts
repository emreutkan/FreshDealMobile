// src/hooks/useNotifications.ts
import {useCallback} from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setIsRegistered, setPushToken} from '@/src/redux/slices/notificationSlice';
import {pushNotificationsApi} from '@/src/redux/api/pushNotifications';
import type {RootState} from '@/src/types/store';

export function useNotifications() {
    const dispatch = useDispatch();
    const {isAuthenticated} = useSelector((state: RootState) => state.user);
    const {pushToken, isRegistered} = useSelector((state: RootState) => state.notification);


    const registerForPushNotificationsAsync = async () => {
        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return null;
        }

        try {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push notification permission');
                return null;
            }

            const expoPushToken = await Notifications.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PROJECT_ID
            });

            if (!expoPushToken.data.startsWith('ExponentPushToken[')) {
                console.error('Invalid push token format:', expoPushToken.data);
                return null;
            }

            return expoPushToken.data;
        } catch (error) {
            console.error('Error getting push token:', error);
            return null;
        }
    };

    const initializeNotifications = useCallback(async () => {
        try {
            if (!isAuthenticated) {
                console.log('User not authenticated, skipping push token registration');
                return;
            }

            const newPushToken = await registerForPushNotificationsAsync();
            if (!newPushToken) {
                console.log('Could not get push token');
                return;
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            dispatch(setPushToken(newPushToken));

            try {
                await pushNotificationsApi.updatePushToken(newPushToken);
                dispatch(setIsRegistered(true));
                console.log('Successfully registered push token with backend');
            } catch (error) {
                console.error('Failed to register token with backend:', error);
                dispatch(setIsRegistered(false));
            }

        } catch (error) {
            console.error('Error initializing notifications:', error);
            dispatch(setIsRegistered(false));
        }
    }, [dispatch, isAuthenticated]);

    return {
        pushToken,
        isRegistered,
        initializeNotifications,
    };
}