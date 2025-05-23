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
import {fetchCart, resetCart} from "@/src/redux/thunks/cartThunks";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import PickUpDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";
import {getRestaurantThunk} from "@/src/redux/thunks/restaurantThunks";

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

            console.log('Final filtered listings:', ListingsInCart);
            if (restaurant) {
                dispatch(setSelectedRestaurant(restaurant));
                dispatch(getRestaurantThunk(restaurant.id))
                if (restaurant.delivery && !restaurant.pickup) {
                    dispatch(setDeliveryMethod(false));
                } else if (!restaurant.delivery && restaurant.pickup) {
                    dispatch(setDeliveryMethod(true));
                }
            } else {
                Alert.alert(
                    'Restaurant not found',
                    'The restaurant is not in proximity. Cart will be cleared.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                dispatch(resetCart());
                            }
                        }
                    ]
                );
            }
        }
    }, [cartItems, restaurantsProximity, dispatch]);

    const ListingsInCart = selectedRestaurantListings.filter(listing => cartItems.some(cartItem => cartItem.listing_id === listing.id));
    console.log(ListingsInCart);
    const isPickup = useSelector((state: RootState) => state.restaurant.isPickup);

    const totalPickUpPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.pick_up_price || 0) * quantity;
    }, 0);

    const totalDeliveryPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.delivery_price || 0) * quantity;
    }, 0);

    const currentTotal = isPickup ? totalPickUpPrice : totalDeliveryPrice;


    const restaurant = restaurantsProximity.find(r => r.id === (cartItems[0]?.restaurant_id));
    const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.count || 1), 0);
    const deliveryFee = (!isPickup && restaurant?.deliveryFee) || 0;
    const finalTotal = currentTotal + deliveryFee;

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <GoBackIcon/>
                    <Text style={styles.headerTitle}>Your Cart</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{totalItemsCount}</Text>
                    </View>
                </View>

                {restaurant && (
                    <View style={styles.headerBottom}>
                        <View style={styles.restaurantInfo}>
                            <Ionicons name="business" size={20} color="#50703C"/>
                            <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
                        </View>

                        <PickUpDeliveryToggle layout="row"/>
                    </View>
                )}
            </View>

            {ListingsInCart.length > 0 ? (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        <View style={styles.cardsContainer}>
                            <ListingCard
                                listingList={ListingsInCart.map(listing => ({
                                    ...listing,
                                    quantity: cartItems.find(ci => ci.listing_id === listing.id)?.count || 1
                                }))}
                                viewType={"rectangle"}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.bottomSection}>
                        <View style={styles.summaryContainer}>
                            {!isPickup && restaurant && (restaurant.deliveryFee ?? 0) > 0 && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.subtotalLabel}>Subtotal</Text>
                                    <Text style={styles.subtotalValue}>{currentTotal.toFixed(2)} TL</Text>
                                </View>
                            )}

                            {!isPickup && restaurant && (restaurant.deliveryFee ?? 0) > 0 && (
                                <View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.subtotalLabel}>Delivery Fee</Text>
                                        <Text
                                            style={styles.subtotalValue}>{(restaurant.deliveryFee ?? 0).toFixed(2)} TL</Text>
                                    </View>
                                    <View style={styles.divider}/>
                                </View>
                            )}

                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalAmount}>
                                    {finalTotal.toFixed(2)} TL
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
                            <MaterialIcons name="shopping-cart-checkout" size={24} color="#FFFFFF"
                                           style={styles.checkoutIcon}/>
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.emptyCartContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="cart-outline" size={80} color="#50703C"/>
                    </View>
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <Text style={styles.emptyCartSubtext}>Add items from restaurants to get started</Text>
                    <TouchableOpacity
                        style={styles.continueShopping}
                        activeOpacity={0.8}
                        onPress={() => {
                            console.log("Navigating to Home");
                            navigation.goBack()
                        }}
                    >
                        <Ionicons name="restaurant-outline" size={20} color="#FFFFFF" style={styles.shoppingIcon}/>
                        <Text style={styles.continueShoppingText}>Browse Restaurants</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: scaleFont(16),
        paddingVertical: scaleFont(16),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scaleFont(12),
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: scaleFont(8),
    },
    headerTitle: {
        fontSize: scaleFont(20),
        fontWeight: '700',
        color: '#111827',
        flex: 1,
        marginLeft: scaleFont(12),
        fontFamily: 'Poppins-Bold',
    },
    badge: {
        backgroundColor: '#50703C',
        borderRadius: 20,
        minWidth: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: scaleFont(14),
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    restaurantName: {
        fontSize: scaleFont(15),
        color: '#4B5563',
        marginLeft: scaleFont(8),
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    cardsContainer: {
        padding: scaleFont(16),
    },
    bottomSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: scaleFont(16),
        paddingTop: scaleFont(16),
        paddingBottom: scaleFont(24),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 5,
    },
    summaryContainer: {
        marginBottom: scaleFont(20),
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: scaleFont(16),
    },
    summaryTitle: {
        fontSize: scaleFont(16),
        fontWeight: '600',
        color: '#111827',
        marginBottom: scaleFont(12),
        fontFamily: 'Poppins-SemiBold',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scaleFont(10),

    },
    summaryItemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemQuantity: {
        fontSize: scaleFont(15),
        fontWeight: '600',
        color: '#50703C',
        marginRight: scaleFont(8),
        fontFamily: 'Poppins-SemiBold',
        minWidth: 24,
    },
    summaryLabel: {
        fontSize: scaleFont(15),
        color: '#4B5563',
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    summaryValue: {
        fontSize: scaleFont(15),
        color: '#111827',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    subtotalLabel: {
        fontSize: scaleFont(15),
        color: '#4B5563',
        fontFamily: 'Poppins-Medium',
    },
    subtotalValue: {
        fontSize: scaleFont(15),
        color: '#111827',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: scaleFont(12),
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginTop: scaleFont(8),
        // paddingTop: scaleFont(12),
        // borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalLabel: {
        fontSize: scaleFont(16),
        color: '#111827',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    totalAmount: {
        fontSize: scaleFont(20),
        color: '#50703C',
        fontWeight: '700',
        fontFamily: 'Poppins-Bold',
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
        fontFamily: 'Poppins-SemiBold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scaleFont(20),
        backgroundColor: '#FFFFFF',
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F9EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scaleFont(20),
    },
    emptyCartText: {
        fontSize: scaleFont(22),
        color: '#111827',
        fontWeight: '700',
        marginBottom: scaleFont(8),
        fontFamily: 'Poppins-Bold',
    },
    emptyCartSubtext: {
        fontSize: scaleFont(15),
        color: '#6B7280',
        marginBottom: scaleFont(28),
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    continueShopping: {
        backgroundColor: '#50703C',
        paddingVertical: scaleFont(14),
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
        fontFamily: 'Poppins-SemiBold',
    },
});

export default CartScreen;