// Header.tsx

import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import AddressBar from "@/src/features/homeScreen/components/AddressBar";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {Feather, Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ExpandedSearchBar from "@/src/features/homeScreen/components/expandedSearchBar";

interface HeaderProps {
    isScrolled: boolean;
    activeTab: string;
    setIsScrolled: (value: boolean) => void; // Callback to update isScrolled

    setActiveTab: (tab: string) => void; // Callback to update activeTab
}

const Header: React.FC<HeaderProps> = ({isScrolled, activeTab, setIsScrolled, setActiveTab}) => {
    const [shouldFocusSearch, setShouldFocusSearch] = useState(false);
    const animation = useRef(new Animated.Value(isScrolled ? 1 : 0)).current;

    const handleSearchBarClick = () => {
        console.log(activeTab)
        if (activeTab === 'HomeMapView') {
            setActiveTab('HomeCardView'); // Switch to HomeCardView tab
        }
        console.log('activeTab', activeTab)
        console.log('Search bar clicked');
        if (isScrolled) {
            console.log('Resetting isScrolled to false');
            setIsScrolled(false); // Correctly update isScrolled via callback
            setShouldFocusSearch(true); // Indicate that focus is needed
        } else {
            setShouldFocusSearch(true); // Handle clicks when not scrolled, if necessary
        }
    };


    useEffect(() => {
        Animated.timing(animation, {
            toValue: isScrolled ? 1 : 0,
            duration: 320,
            useNativeDriver: false,
        }).start(() => {
            console.log('Animation completed');
        });
    }, [isScrolled]);

    // Interpolations for dynamic styles
    const headerHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [scaleFont(160), scaleFont(110)], // Expanded to Collapsed height
    });

    const searchBarOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1], // Opacity remains the same; adjust if needed
    });

    const insets = useSafeAreaInsets();

    return (
        <Animated.View style={[
            styles.header,
            {height: headerHeight},
            {paddingTop: insets.top},
            activeTab === 'HomeMapView' ? styles.transparentHeader : null
        ]}>
            <View style={styles.container}>
                <View style={styles.topRow}>
                    <View style={styles.addressBarContainer}>
                        <AddressBar/>
                    </View>

                    <View style={styles.iconContainer}>
                        <FavoritesBar/>
                        {isScrolled && (
                            <Animated.View style={[styles.collapsedSearchWrapper, {opacity: searchBarOpacity}]}>
                                <CollapsedSearchBar onPress={handleSearchBarClick}/>
                            </Animated.View>
                        )}
                    </View>
                </View>

                {!isScrolled && (
                    <Animated.View style={[styles.expandedSearchWrapper, {opacity: searchBarOpacity}]}>
                        <ExpandedSearchBar
                            shouldFocus={shouldFocusSearch}
                            onFocus={() => {
                                console.log('TextInput focused');
                                setShouldFocusSearch(false); // Reset focus flag after focusing
                            }}
                        />
                    </Animated.View>
                )}
            </View>
        </Animated.View>
    );
};

const CollapsedSearchBar: React.FC<{ onPress: () => void }> = React.memo(({onPress}) => (
    <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={onPress}>
            <Feather name="search" size={24} color="#000"/>
        </TouchableOpacity>
    </View>
));

const FavoritesBar: React.FC = () => {
    const handleRouteToFavoritesScreen = () => {
        // Implement navigation to Favorites screen
    };

    return (
        <TouchableOpacity
            onPress={handleRouteToFavoritesScreen}
            style={styles.favoritesBarContainer}
        >
            <Ionicons name="heart-outline" size={scaleFont(24)} color="#000"/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderColor: '#b2f7a5',
        borderBottomLeftRadius: scaleFont(20),
        borderBottomRightRadius: scaleFont(20),
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
        overflow: 'hidden',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: scaleFont(10),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressBarContainer: {
        maxWidth: '65%', // Adjusted to 65% as per your initial code
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    collapsedSearchWrapper: {
        marginLeft: scaleFont(10),
    },
    expandedSearchWrapper: {
        // Add styles if needed
    },
    expandedSearchBarContainer: {
        paddingTop: scaleFont(10),
        paddingHorizontal: scaleFont(10),
    },
    expandedSearchBar: {
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(15),
        borderRadius: scaleFont(20),
        backgroundColor: '#f9f9f9',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    searchBarContainer: {
        paddingRight: scaleFont(10),
    },
    favoritesBarContainer: {
        paddingRight: scaleFont(10),
    },
    transparentHeader: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
    },
});

export default Header;
