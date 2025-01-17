import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, FlatList, Image, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {addItemToCart, fetchCart, removeItemFromCart, updateCartItem,} from '@/src/redux/thunks/cartThunks';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';
import {Listing} from "@/src/types/api/listing/model";
import {lightHaptic} from "@/src/utils/Haptics";

interface ListingCardProps {
    listingList: Listing[];
    isPickup: boolean;
}


export const ListingCard: FC<ListingCardProps> = ({listingList, isPickup}) => {
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const dispatch = useDispatch<AppDispatch>();

    // Get the entire cart state from Redux
    const cart = useSelector((state: RootState) => state.cart);
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const renderListingItem = ({item}: { item: Listing }) => {
        const displayPrice = isPickup
            ? item.pick_up_price ?? 0
            : item.delivery_price ?? 0;

        // Get the corresponding cart item (if any) by matching listing_id.
        const cartItem = cart.cartItems.find(
            (cartItem) => cartItem.listing_id === item.id
        );
        const countInCart = cartItem ? cartItem.count : 0;

        let discountPercentage = 0;
        if (item.original_price && item.original_price > 0) {
            const diff = item.original_price - displayPrice;
            discountPercentage = Math.round((diff / item.original_price) * 100);
        }

        const handleAddToCart = async () => {
            lightHaptic();
            const existingCartItems = cart.cartItems;

            // If there are items in the cart, check if they belong to the same restaurant
            if (existingCartItems.length > 0) {
                const existingRestaurantId = existingCartItems[0].restaurant_id;
                if (existingRestaurantId !== item.restaurant_id) {
                    console.log(existingCartItems)
                    console.log(existingRestaurantId)
                    console.log(item.restaurant_id)
                    alert(
                        'You can only add items from the same restaurant to your cart. ' +
                        'Please empty your cart first or complete your current order.'
                    );
                    return;
                }
            }

            // Check if adding one more would exceed the item's available count
            if (countInCart >= item.count) {
                alert('You have reached the maximum quantity for this item');
                return;
            }

            // Add or update the item in the cart
            if (countInCart === 0) {
                dispatch(addItemToCart({payload: {listing_id: item.id}}));
            } else {
                dispatch(
                    updateCartItem({payload: {listing_id: item.id, count: countInCart + 1}})
                );
            }
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        };

        const handleRemoveOneFromCart = () => {
            lightHaptic()
            if (countInCart === 1) {
                dispatch(removeItemFromCart({listing_id: item.id}));
            } else {
                dispatch(
                    updateCartItem({payload: {listing_id: item.id, count: countInCart - 1}})
                );
            }
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        };

        return (
            <View style={styles.listingItem}>
                {item.image_url ? (
                    <Image
                        source={{uri: item.image_url}}
                        style={styles.listingImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.listingImage, styles.noImage]}>
                        <Text style={styles.noImageText}>No Image</Text>
                    </View>
                )}

                <View style={styles.listingDetails}>
                    <Text style={styles.listingTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.listingDescription} numberOfLines={2}>
                        {item.description}
                    </Text>

                    <View style={styles.priceRow}>
                        {item.original_price !== null && item.original_price > 0 && (
                            <Text style={styles.originalPrice}>
                                {item.original_price} TL
                            </Text>
                        )}
                        <Text style={styles.displayPrice}>{displayPrice} TL</Text>
                        {discountPercentage > 0 && (
                            <View style={styles.discountContainer}>
                                <Text style={styles.discountText}>
                                    {discountPercentage}% OFF
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {countInCart > 0 ? (
                    <View style={styles.cartControls}>
                        <TouchableOpacity
                            style={[styles.button, styles.decrementButton]}
                            onPress={handleRemoveOneFromCart}
                        >
                            <Text style={[styles.buttonText, styles.decrementButtonText]}>
                                -
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.countText}>{countInCart}</Text>

                        <TouchableOpacity
                            style={[styles.button, styles.incrementButton]}
                            onPress={handleAddToCart}
                        >
                            <Text style={[styles.buttonText, styles.incrementButtonText]}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {listingList.length > 0 ? (
                <FlatList
                    data={listingList}
                    renderItem={renderListingItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <Text>No listings found.</Text>
            )}
        </View>
    );
};

export default ListingCard;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 16,
    },
    listingItem: {

        flexDirection: 'row',
        marginVertical: 10,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        // Enhanced shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        // Add border for better definition
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    listingImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        marginRight: 16,
    },
    noImage: {
        backgroundColor: '#E5E9F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        color: '#8390A3',
        fontSize: 12,
    },
    listingDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    listingTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1D1E',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    listingDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 20,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    originalPrice: {
        fontSize: 15,
        color: '#9CA3AF',
        marginRight: 10,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    displayPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#059669', // Green color for price
        marginRight: 10,
    },
    discountContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#ECFDF5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#059669',
    },
    discountText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#059669',
    },
    cartControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
    },
    button: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    decrementButton: {
        backgroundColor: '#FEE2E2',
    },
    incrementButton: {
        backgroundColor: '#ECFDF5',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    decrementButtonText: {
        color: '#DC2626',
    },
    incrementButtonText: {
        color: '#059669',
    },
    countText: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D1E',
        minWidth: 24,
        textAlign: 'center',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#059669',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        // Add subtle shadow
        shadowColor: '#059669',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 16,
    },
});