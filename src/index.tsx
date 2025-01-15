import React, {useCallback, useEffect, useState} from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading'; // Optional: For splash screen during loading
import AppContent from "@/src/app";

const App: React.FC = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const loadFonts = useCallback(async () => {
        await Font.loadAsync({
            'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
            'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
            'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
            'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        });
        setFontsLoaded(true);
    }, []);

    useEffect(() => {
        loadFonts();
    }, [loadFonts]);

    if (!fontsLoaded) {
        return <AppLoading/>;
    }

    return <AppContent/>;
};

export default App;
