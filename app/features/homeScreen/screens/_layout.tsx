// Layout.tsx
import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import AddressSelectorScreen from "@/app/features/addressSelection/screens/addressSelectionScreen";
import AfterLoginScreen from "@/app/features/homeScreen/screens/home";
import {LayoutAnimation, Platform, SafeAreaView, ScrollView, StyleSheet, UIManager, View,} from 'react-native';
import Header from "@/app/features/homeScreen/components/Header";

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
    const handleScroll = useCallback((e: { nativeEvent: { contentOffset: { y: number; }; }; }) => {
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
        <SafeAreaView style={styles.container}>
            <Header isScrolled={isScrolled}/>
            <View style={styles.contentContainer}>
                <ScrollView
                    style={styles.scrollView}
                    onScroll={handleScroll}
                    scrollEventThrottle={16} // For smooth performance
                    contentContainerStyle={styles.scrollContent}
                >
                    <AfterLoginScreen/>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 50, // Ensure content isn't hidden behind navbar
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
