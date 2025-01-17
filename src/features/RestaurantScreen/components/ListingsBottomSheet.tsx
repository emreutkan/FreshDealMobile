import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {addDays} from 'date-fns';
import {Listing} from "@/src/types/api/listing/model";
import {Portal} from '@gorhom/portal'; // You'll need to install @gorhom/portal
interface ListingBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheetModal>;
    selectedListing: Listing | null;
    isPickup: boolean;
    handleAddToCart: (item: Listing) => void;
    handleRemoveFromCart: (item: Listing) => void;
    cartItemCount: number;
    getDisplayPrice: (item: Listing) => number;
    snapPoints: string[]; // Add this prop
}

export const ListingBottomSheet: React.FC<ListingBottomSheetProps> = ({
                                                                          bottomSheetRef,
                                                                          selectedListing,
                                                                          isPickup,
                                                                          handleAddToCart,
                                                                          handleRemoveFromCart,
                                                                          cartItemCount,
                                                                          getDisplayPrice,
                                                                          snapPoints,
                                                                      }) => {
    if (!selectedListing) return null;

    const displayPrice = getDisplayPrice(selectedListing);
    const expiryDate = addDays(new Date(), selectedListing.consume_within);
    const countInCart = cartItem ? cartItem.count : 0;

    return (
        <Portal>
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose
                index={1}
                enableHandlePanningGesture={true}
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.bottomSheetIndicator}
            >
                {/* ... rest of the content ... */}
                <View style={styles.modalCartSection}>
                    {cartItemCount > 0 ? ( // Changed from countInCart to cartItemCount
                        <View style={styles.cartControls}>
                            <TouchableOpacity
                                style={styles.cartButton}
                                onPress={() => handleRemoveFromCart(selectedListing)}
                            >
                                <Icon name="minus" size={24} color="#DC2626"/>
                            </TouchableOpacity>
                            <Text style={styles.cartCount}>{cartItemCount}</Text>
                            <TouchableOpacity
                                style={styles.cartButton}
                                onPress={() => handleAddToCart(selectedListing)}
                            >
                                <Icon name="plus" size={24} color="#059669"/>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => handleAddToCart(selectedListing)}
                        >
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                            <Text style={styles.cartPriceText}>{displayPrice} TL</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </BottomSheetModal>
        </Portal>
    );
};
const styles = StyleSheet.create({
    // Copy your existing styles related to the bottom sheet
    bottomSheet: {
        zIndex: 999,
    },
    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

    },
    bottomSheetIndicator: {
        backgroundColor: '#CBD5E1',
        width: 40,
        height: 4,
        borderRadius: 2,
    },
});