// Layout.tsx
import React, {useCallback, useState} from 'react';
import {
    LayoutAnimation,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    SafeAreaView,
    StyleSheet,
    UIManager,
} from 'react-native';
import Header from "@/app/features/homeScreen/components/Header";
import Home from "@/app/features/homeScreen/screens/Home";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import AddressSelectorScreen from "@/app/features/addressSelection/screens/addressSelectionScreen";

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
        property: LayoutAnimation.Properties.opacity,
    },
};

const Layout: React.FC = () => {
    const addresses = useSelector((state: RootState) => state.address.addresses);
    const [isScrolled, setIsScrolled] = useState(false); // Default to not scrolled

    // Handle scroll event
    const handleScroll = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const scrolled = e.nativeEvent.contentOffset.y > 50;
            // Only trigger animation if scrolled state changes
            if (scrolled !== isScrolled) {
                LayoutAnimation.configureNext(customLayoutAnimation);
                setIsScrolled(scrolled);
            }
        },
        [isScrolled]
    );

    if (!addresses || addresses.length === 0) {
        return <AddressSelectorScreen/>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header isScrolled={isScrolled}/>
            <Home onScroll={handleScroll}/>
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
