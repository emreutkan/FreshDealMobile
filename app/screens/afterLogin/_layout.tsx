// Layout.tsx
import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import AddressSelectorScreen from "@/app/screens/addressScreen/addressSelectionScreen";
import AfterLoginScreen from "@/app/screens/afterLogin/afterlogin";
import {LayoutAnimation, Platform, ScrollView, StyleSheet, UIManager, View,} from 'react-native';
import Header from "@/components/afterloginComponents/Header";

// Enable LayoutAnimation on Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define the custom LayoutAnimation configuration
const customLayoutAnimation = {
    duration: 200,
    update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity, // We'll manage opacity separately
    },
};

const Layout = () => {
    const addresses = useSelector((state: RootState) => state.user.addresses);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll event
    const handleScroll = useCallback((e) => {
        const scrolled = e.nativeEvent.contentOffset.y > 50;
        // Only trigger animation if scrolled state changes
        if (scrolled !== isScrolled) {
            LayoutAnimation.configureNext(customLayoutAnimation);
            setIsScrolled(scrolled);
        }
    }, [isScrolled]);

    if (!addresses || addresses.length === 0) {
        return <AddressSelectorScreen/>;
    }

    return (
        <View style={styles.container}>
            <Header isScrolled={isScrolled}/>
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16} // For smooth performance
                contentContainerStyle={{paddingBottom: 50}} // Ensure content isn't hidden behind navbar
            >
                <AfterLoginScreen/>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    screen: {
        flex: 1,
    },
    placeholderText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
    },
});

export default Layout;
