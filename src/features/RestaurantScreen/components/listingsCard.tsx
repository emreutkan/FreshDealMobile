import React, {FC, useEffect} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {addItemToCart, fetchCart, removeItemFromCart, updateCartItem,} from '@/src/redux/thunks/cartThunks';
import {Listing} from '@/src/redux/slices/listingSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';

interface ListingCardProps {
    listingList: Listing[];
    isPickup: boolean;
}


export const ListingCard: FC<ListingCardProps> = ({listingList, isPickup}) => {

    const dispatch = useDispatch<AppDispatch>();
    // 1) Grab the entire cart from Redux here
    const cart = useSelector((state: RootState) => state.cart);
    useEffect(() => {
        dispatch(fetchCart());
    }, []);


    const renderListingItem = ({item}: { item: Listing }) => {
        const displayPrice = isPickup
            ? item.pick_up_price ?? 0
            : item.delivery_price ?? 0;

        // 2) Now get countInCart from the cart in Redux
        const cartItem = cart.cartItems.find(
            (cartItem: any) => cartItem.listing_id === item.id
        );
        const countInCart = cartItem ? cartItem.count : 0;

        let discountPercentage = 0;
        if (item.original_price && item.original_price > 0) {
            const diff = item.original_price - displayPrice;
            discountPercentage = Math.round((diff / item.original_price) * 100);
        }

        const handleAddToCart = async () => {
            if (countInCart === 0) {
                dispatch(addItemToCart({listingId: item.id}));
            } else if (countInCart === item.count) {
                // If there's some max quantity logic, keep it or remove it if incorrect
                alert('You have reached the maximum quantity for this item');
            } else {
                dispatch(
                    updateCartItem({
                        listingId: item.id,
                        count: countInCart + 1,
                    })
                );
            }

        };


        const handleRemoveOneFromCart = () => {
            if (countInCart === 1) {
                dispatch(removeItemFromCart({listingId: item.id}));
            } else {
                dispatch(
                    updateCartItem({
                        listingId: item.id,
                        count: countInCart - 1,
                    })
                );
            }
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
                    <View style={[styles.listingImage, styles.noImage]}/>
                )}

                <View style={styles.listingDetails}>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text style={styles.listingDescription}>{item.description}</Text>

                    <View style={styles.priceRow}>
                        {item.original_price !== null && item.original_price > 0 && (
                            <Text style={styles.originalPrice}>{item.original_price} TL</Text>
                        )}

                        <Text style={styles.displayPrice}>{displayPrice} TL</Text>

                        {discountPercentage > 0 && (
                            <View style={styles.discountContainer}>
                                <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
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
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.countText}>{countInCart}</Text>

                        <TouchableOpacity
                            style={[styles.button, styles.incrementButton]}
                            onPress={handleAddToCart}
                        >
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

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
    },
    listingItem: {
        flexDirection: 'row',
        marginVertical: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#FFF',
        alignItems: 'center',
        // shadow for iOS, elevation for Android
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    listingImage: {

        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    noImage: {
        backgroundColor: '#ccc',
    },
    listingDetails: {
        flex: 1,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    listingDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
        textDecorationLine: 'line-through',
    },
    displayPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    discountContainer: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: '#EBF9ED',
        borderRadius: 4,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#34A853',
    },

    /* Cart Controls */
    cartControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    button: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    decrementButton: {
        backgroundColor: '#ef5350',
    },
    incrementButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    countText: {
        marginHorizontal: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    /* Single + Button */
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    addButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '600',
    },
});
