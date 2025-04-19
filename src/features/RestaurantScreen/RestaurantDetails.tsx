import React, {createContext, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import CartBar from "@/src/features/RestaurantScreen/components/cartBar";
import RestaurantInfoSection from "@/src/features/RestaurantScreen/components/RestaurantInfoSection";
import {RootState} from "@/src/types/store";
import ListingCard from "@/src/features/RestaurantScreen/components/listingsCard";

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

// Create context to share scroll animation value
export const ScrollContext = createContext<{
    scrollY: Animated.Value;
    headerHeight?: number;
    setHeaderHeight?: (height: number) => void;
}>({
    scrollY: new Animated.Value(0)
});

const RestaurantDetails: React.FC = () => {
    // Redux state
    const cart = useSelector((state: RootState) => state.cart);
    const listings = useSelector((state: RootState) => state.restaurant.selectedRestaurantListings);

    // Create animated value for scrolling
    const scrollY = useRef(new Animated.Value(0)).current;

    // Track header height
    const [headerHeight, setHeaderHeight] = useState(0);

    return (
        <ScrollContext.Provider value={{
            scrollY,
            headerHeight,
            setHeaderHeight
        }}>
            <View style={styles.container}>
                {/* Restaurant info section */}
                <Animated.View
                    style={[
                        styles.headerContainer,
                        {
                            transform: [{
                                translateY: scrollY.interpolate({
                                    inputRange: [0, headerHeight],
                                    outputRange: [0, -headerHeight],
                                    extrapolate: 'clamp'
                                })
                            }]
                        }
                    ]}
                >
                    <RestaurantInfoSection onLayout={(e) => {
                        if (!headerHeight) {
                            setHeaderHeight(e.nativeEvent.layout.height);
                        }
                    }}/>
                </Animated.View>

                {/* Listings container - covers full screen */}
                <View style={styles.listingsContainer}>
                    {listings.length > 0 ? (
                        <ListingCard fullHeight={SCREEN_HEIGHT}/>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No listings found.</Text>
                        </View>
                    )}
                </View>

                {cart.cartItems.length > 0 && (
                    <CartBar/>
                )}
            </View>
        </ScrollContext.Provider>
    );
};

export default RestaurantDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#FFFFFF',
    },
    listingsContainer: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
    },
    emptyText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#666666',
    }
});