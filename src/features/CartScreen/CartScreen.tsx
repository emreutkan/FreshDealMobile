import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "@/src/utils/navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import GoBack from "@/src/features/homeScreen/components/goBack";
import {scaleFont} from "@/src/utils/ResponsiveFont";

const CartScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute<RouteProp<RootStackParamList, 'Cart'>>();
    const insets = useSafeAreaInsets();

    const cart = useSelector((state: RootState) => state.cart.cartItems);
    const listings = useSelector((state: RootState) => state.listing.listings);
    const ListingsInCart = listings.filter(listing => cart.some(cartItem => cartItem.listing_id));

    // Calculate total price (assuming you have a price field)
    const totalPrice = ListingsInCart.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            {/* Header Section */}
            <View style={styles.header}>
                <GoBack/>
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
                        {/*<View style={styles.cardsContainer}>*/}
                        {/*    <ListingCard listingList={ListingsInCart}/>*/}
                        {/*</View>*/}
                    </ScrollView>

                    {/* Bottom Section with Total and Checkout */}
                    <View style={styles.bottomSection}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
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