import React, {useEffect} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from '@/src/types/store';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import ListingCard from "@/src/features/RestaurantScreen/components/listingsCard";
import {setSelectedRestaurant} from "@/src/redux/slices/restaurantSlice";
import {fetchCart} from "@/src/redux/thunks/cartThunks";

const CartScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const insets = useSafeAreaInsets();

    const {cartItems, restaurantsProximity, selectedRestaurantListings} = useSelector((state: RootState) => ({
        cartItems: state.cart.cartItems,
        restaurantsProximity: state.restaurant.restaurantsProximity,
        selectedRestaurantListings: state.restaurant.selectedRestaurantListings,
    }));
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);
    useEffect(() => {
        if (cartItems.length > 0) {
            const firstCartItem = cartItems[0];
            const restaurantId = firstCartItem.restaurant_id;
            console.log('Looking for restaurant with ID:', restaurantId);
            console.log('Available restaurants:', restaurantsProximity);

            const restaurant = restaurantsProximity.find(r => r.id === restaurantId);
            console.log('Found restaurant:', restaurant);
            const ListingsInCart = selectedRestaurantListings.filter(listing => {
                const isInCart = cartItems.some(cartItem => {
                    console.log(`Comparing listing ${listing.id} with cart item listing_id ${cartItem.listing_id}`);
                    return cartItem.listing_id === listing.id;
                });
                console.log(`Listing ${listing.id} (${listing.title}) in cart: ${isInCart}`);
                return isInCart;
            });

            // Log the final filtered listings
            console.log('Final filtered listings:', ListingsInCart);
            if (restaurant) {
                dispatch(setSelectedRestaurant(restaurant));
            } else {
                Alert.alert('Restaurant not found', 'The restaurant is not in proximity. Cart will be cleared.');
            }
        }
    }, [cartItems, restaurantsProximity, dispatch]);

    const ListingsInCart = selectedRestaurantListings.filter(listing => cartItems.some(cartItem => cartItem.listing_id === listing.id));
    console.log(ListingsInCart);
    const totalPickUpPrice = ListingsInCart.reduce((sum, item) => sum + (item.pick_up_price || 0), 0);
    const totalDeliveryPrice = ListingsInCart.reduce((sum, item) => sum + (item.delivery_price || 0), 0);

    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            {/* Header Section */}
            <View style={styles.header}>
                <GoBackIcon/>
                <Text style={styles.headerTitle}>Your Cart</Text>
                <Text style={styles.itemCount}>{ListingsInCart.length} items</Text>
            </View>

            {/* Main Content */}
            {ListingsInCart.length > 0 ? (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.cardsContainer}>
                            <ListingCard listingList={ListingsInCart}/>
                        </View>
                    </ScrollView>

                    {/* Bottom Section with Total and Checkout */}
                    <View style={styles.bottomSection}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>${totalPickUpPrice.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton}>
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                // Empty Cart State
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <TouchableOpacity style={styles.continueShopping}>
                        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: scaleFont(16),
        paddingBottom: scaleFont(16),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: scaleFont(24),
        fontWeight: '700',
        color: '#333333',
        marginTop: scaleFont(8),
    },
    itemCount: {
        fontSize: scaleFont(14),
        color: '#666666',
        marginTop: scaleFont(4),
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    cardsContainer: {
        padding: scaleFont(16),
    },
    bottomSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: scaleFont(16),
        paddingVertical: scaleFont(20),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scaleFont(16),
    },
    totalLabel: {
        fontSize: scaleFont(16),
        color: '#333333',
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: scaleFont(24),
        color: '#333333',
        fontWeight: '700',
    },
    checkoutButton: {
        backgroundColor: '#007AFF',
        borderRadius: scaleFont(12),
        paddingVertical: scaleFont(16),
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: scaleFont(16),
        fontWeight: '600',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scaleFont(20),
    },
    emptyCartText: {
        fontSize: scaleFont(18),
        color: '#666666',
        marginBottom: scaleFont(16),
    },
    continueShopping: {
        paddingVertical: scaleFont(12),
        paddingHorizontal: scaleFont(24),
        borderRadius: scaleFont(8),
        backgroundColor: '#007AFF',
    },
    continueShoppingText: {
        color: '#FFFFFF',
        fontSize: scaleFont(16),
        fontWeight: '600',
    },
});

export default CartScreen;