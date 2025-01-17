import React, {useEffect} from 'react';
import {Animated, Platform, StyleSheet, View} from 'react-native';
import AddressBar from "@/src/features/homeScreen/components/AddressBar";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CartIcon from "@/src/features/RestaurantScreen/components/CartIcon";

interface HeaderProps {
    activeTab: string;
    scrollY?: Animated.Value;
}

export const Header: React.FC<HeaderProps> = ({activeTab, scrollY}) => {
    useEffect(() => {
        if (scrollY) {
            console.log("ScrollY is present in Header");
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
        inputRange: [200, 300],
        outputRange: ['#ffffff', '#b0f484'],
        extrapolate: 'clamp'
    }) || '#ffffff';

    const contentColor = scrollY?.interpolate({
        inputRange: [0, 50],
        outputRange: ['#000000', '#ffffff'],
        extrapolate: 'clamp'
    }) || '#000000';

    const isMapView = activeTab === 'HomeMapView';

    return (
        <Animated.View
            style={[
                styles.header,
                {
                    paddingTop: insets.top,
                    backgroundColor: isMapView ? 'rgba(255, 255, 255, 0.65)' : headerBackgroundColor,
                },
                isMapView && styles.icyHeader,
            ]}
        >
            <View style={[
                styles.container,
                isMapView && styles.icyContainer
            ]}>
                <View style={styles.topRow}>
                    <View style={styles.addressBarContainer}>
                        <AddressBar textColor={contentColor || '#000000'}/>
                    </View>
                    <View style={styles.iconContainer}>
                        <CartIcon/>
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
    icyHeader: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: Platform.select({
            ios: 'rgba(255, 255, 255, 0.65)',
            android: 'rgba(255, 255, 255, 0.75)',
        }),
        backdropFilter: 'blur(10px)',
        shadowColor: '#fff',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: Platform.select({
            ios: 0.5,
            android: 1,
        }),
    },
    icyContainer: {
        backgroundColor: Platform.select({
            ios: 'rgba(255, 255, 255, 0.15)',
            android: 'rgba(255, 255, 255, 0.2)',
        }),
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
});

export default Header;