import React, {useEffect} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from '@/src/types/store';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import ListingCard from "@/src/features/RestaurantScreen/components/listingsCard";
import {setDeliveryMethod, setSelectedRestaurant} from "@/src/redux/slices/restaurantSlice";
import {fetchCart} from "@/src/redux/thunks/cartThunks";
import {Ionicons} from "@expo/vector-icons";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import PickUpDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";

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
                if (restaurant.delivery && !restaurant.pickup) {
                    dispatch(setDeliveryMethod(false));
                } else if (!restaurant.delivery && restaurant.pickup) {
                    dispatch(setDeliveryMethod(true));
                }
            } else {
                Alert.alert('Restaurant not found', 'The restaurant is not in proximity. Cart will be cleared.');
            }
        }
    }, [cartItems, restaurantsProximity, dispatch]);

    const ListingsInCart = selectedRestaurantListings.filter(listing => cartItems.some(cartItem => cartItem.listing_id === listing.id));
    console.log(ListingsInCart);
    const isPickup = useSelector((state: RootState) => state.restaurant.isPickup);

    const totalPickUpPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1; // Default to 1 if count is not found
        return sum + (item.pick_up_price || 0) * quantity;
    }, 0);
    const totalDeliveryPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1; // Default to 1 if count is not found
        return sum + (item.delivery_price || 0) * quantity;
    }, 0);

    const currentTotal = isPickup ? totalPickUpPrice : totalDeliveryPrice;
    const calculateItemSubtotal = (listing: any, isPickup: boolean) => {
        const cartItem = cartItems.find(ci => ci.listing_id === listing.id);
        const quantity = cartItem?.count || 1;
        const price = isPickup ? listing.pick_up_price : listing.delivery_price;
        return (price || 0) * quantity;
    };
    const restaurant = restaurantsProximity.find(r => r.id === (cartItems[0]?.restaurant_id));
    const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.count || 1), 0);
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <GoBackIcon/>
                    <Text style={styles.headerTitle}>Your Cart</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{totalItemsCount}</Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', // Add this
                    alignItems: 'center',           // Add this
                    width: '100%'                   // Add this
                }}>
                    {restaurant && (
                        <View style={styles.restaurantInfo}>
                            <Ionicons name="business" size={20} color="#666666"/>
                            <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
                        </View>
                    )}

                    <PickUpDeliveryToggle layout="row"/>
                </View>
            </View>

            {/* Main Content */}
            {ListingsInCart.length > 0 ? (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.cardsContainer}>
                            <ListingCard
                                listingList={ListingsInCart.map(listing => ({
                                    ...listing,
                                    quantity: cartItems.find(ci => ci.listing_id === listing.id)?.count || 1
                                }))} viewType="rectangle"
                            /> </View>
                    </ScrollView>

                    {/* Bottom Section with Total and Checkout */}
                    <View style={styles.bottomSection}>
                        <View style={styles.summaryContainer}>
                            {ListingsInCart.map(listing => (
                                <View key={listing.id} style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>
                                        {listing.title} (x{cartItems.find(ci => ci.listing_id === listing.id)?.count || 1})
                                    </Text>
                                    <Text style={styles.summaryValue}>
                                        {calculateItemSubtotal(listing, isPickup).toFixed(2)} TL
                                    </Text>
                                </View>
                            ))}
                            {!isPickup && restaurant && restaurant.deliveryFee && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                    <Text style={styles.summaryValue}>{restaurant.deliveryFee.toFixed(2)} TL</Text>
                                </View>
                            )}
                            <View style={styles.divider}/>
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalAmount}>
                                    {(currentTotal + (!isPickup ? restaurant?.deliveryFee || 0 : 0)).toFixed(2)} TL
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            activeOpacity={0.8}
                            onPress={() => {
                                console.log("Navigating to Checkout");
                                navigation.navigate('Checkout');
                            }}
                        >
                            <Ionicons name="cart" size={24} color="#FFFFFF" style={styles.checkoutIcon}/>

                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                // Empty Cart State
                <View style={styles.emptyCartContainer}>
                    <Ionicons name="cart-outline" size={100} color="#CCCCCC"/>
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <Text style={styles.emptyCartSubtext}>Add items to get started</Text>
                    <TouchableOpacity
                        style={styles.continueShopping}
                        activeOpacity={0.8}
                        onPress={() => {
                            console.log("Navigating to Home");
                            navigation.goBack()
                        }}
                    >
                        <Ionicons name="business-outline" size={20} color="#FFFFFF" style={styles.shoppingIcon}/>
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
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingHorizontal: scaleFont(16),
        paddingBottom: scaleFont(16),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scaleFont(8),
    },
    headerTitle: {
        fontSize: scaleFont(20),
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginLeft: scaleFont(12),
        fontFamily: 'Poppins-Regular',
    },
    badge: {
        backgroundColor: '#50703C',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: scaleFont(12),
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scaleFont(8),
    },
    restaurantName: {
        fontSize: scaleFont(14),
        color: '#666666',
        marginLeft: scaleFont(8),
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    cardsContainer: {
        padding: scaleFont(16),
    },
    bottomSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: scaleFont(16),
        paddingVertical: scaleFont(20),
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    summaryContainer: {
        marginBottom: scaleFont(20),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleFont(8),
    },
    summaryLabel: {
        fontSize: scaleFont(14),
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    summaryValue: {
        fontSize: scaleFont(14),
        color: '#333333',
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: scaleFont(12),
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: scaleFont(18),
        color: '#333333',
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    totalAmount: {
        fontSize: scaleFont(24),
        color: '#50703C',
        fontWeight: '700',
        fontFamily: 'Poppins-Regular',
    },
    checkoutButton: {
        backgroundColor: '#50703C',
        borderRadius: scaleFont(12),
        paddingVertical: scaleFont(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkoutIcon: {
        marginRight: scaleFont(8),
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: scaleFont(16),
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scaleFont(20),
        backgroundColor: '#f8f9fa',
    },
    emptyCartText: {
        fontSize: scaleFont(20),
        color: '#333333',
        fontWeight: '600',
        marginTop: scaleFont(20),
        marginBottom: scaleFont(8),
        fontFamily: 'Poppins-Regular',
    },
    emptyCartSubtext: {
        fontSize: scaleFont(14),
        color: '#666666',
        marginBottom: scaleFont(24),
        fontFamily: 'Poppins-Regular',
    },
    continueShopping: {
        backgroundColor: '#50703C',
        paddingVertical: scaleFont(12),
        paddingHorizontal: scaleFont(24),
        borderRadius: scaleFont(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    shoppingIcon: {
        marginRight: scaleFont(8),
    },
    continueShoppingText: {
        color: '#FFFFFF',
        fontSize: scaleFont(16),
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
});
export default CartScreen;