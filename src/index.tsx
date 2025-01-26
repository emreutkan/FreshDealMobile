// App.tsx
import React, {useCallback, useEffect, useState} from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppContent from "./app";
import {Provider} from 'react-redux';
import {store} from '@/src/redux/store';
import * as Notifications from 'expo-notifications';
import {initializeTokenService} from "@/src/services/tokenService";
import {View} from 'react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

initializeTokenService({
    getStateToken: () => store.getState().user.token
});

const App: React.FC = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({
                    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
                    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
                    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
                    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
                    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
                    'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf'),
                    'Poppins-Thin': require('./assets/fonts/Poppins-Thin.ttf'),
                });
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <Provider store={store}>
            <View style={{flex: 1}} onLayout={onLayoutRootView}>
                <AppContent/>
            </View>
        </Provider>
    );
};

export default App;