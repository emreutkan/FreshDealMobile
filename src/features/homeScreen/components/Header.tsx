import React, {useEffect} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import AddressBar from "@/src/features/homeScreen/components/AddressBar";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CartIcon from "@/src/features/RestaurantScreen/components/CartIcon";

interface HeaderProps {
    activeTab: string;
    scrollY?: Animated.Value; // Add this new prop

}

export const Header: React.FC<HeaderProps> = ({activeTab, scrollY}) => {

    useEffect(() => {
        if (scrollY) {
            console.log("ScrollY is present in Header");

            // Add a listener to track scroll value changes
            const scrollListener = scrollY.addListener((state) => {
                console.log("Scroll value:", state.value);
            });

            return () => {
                scrollY.removeListener(scrollListener);
            };
        } else {
            console.log("No scrollY provided to Header");
        }
    }, [scrollY]);
    const insets = useSafeAreaInsets();
    const headerBackgroundColor = scrollY?.interpolate({
        inputRange: [200, 300], // Start changing at 50px of scroll
        outputRange: ['#ffffff', '#b0f484'], // From white to dark green
        extrapolate: 'clamp'
    }) || '#ffffff';

    const contentColor = scrollY?.interpolate({
        inputRange: [0, 50],
        outputRange: ['#000000', '#ffffff'], // From black to white
        extrapolate: 'clamp'
    }) || '#000000';
    return (
        <Animated.View
            style={[
                styles.header,
                {
                    paddingTop: insets.top,
                    backgroundColor: headerBackgroundColor || '#121212',
                },
                activeTab === 'HomeMapView' ? styles.transparentHeader : null,
            ]}
        >
            <View style={styles.container}>
                <View style={styles.topRow}>
                    <View style={styles.addressBarContainer}>
                        <AddressBar textColor={contentColor || '#000000'}/>
                    </View>
                    <View style={styles.iconContainer}>
                        <CartIcon></CartIcon>

                    </View>
                </View>
            </View>
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderColor: '#b2f7a5',
        // borderBottomLeftRadius: scaleFont(20),
        // borderBottomRightRadius: scaleFont(20),
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
        overflow: 'hidden',
        borderWidth: 1,
        borderTopWidth: 0,
        height: scaleFont(110),
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
        maxWidth: '65%',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    transparentHeader: {
        backgroundColor: "rgba(255,255,255,0.42)",
        shadowRadius: 0,
        borderColor: 'transparent',

    },
});

export default Header;
