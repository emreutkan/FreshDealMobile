import React, {useCallback} from "react";
import {FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/src/redux/store";
import {RootState} from "@/src/types/store";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {addFavoriteThunk, removeFavoriteThunk} from "@/src/redux/thunks/userThunks";
import {useHandleRestaurantPress} from "@/src/hooks/handleRestaurantPress";
import {tokenService} from "@/src/services/tokenService";
import {calculateDistanceToRestaurant, isRestaurantOpen} from "@/src/utils/RestaurantFilters";

interface RestaurantListProps {
    restaurants: Restaurant[];
}

const calculateDeliveryTime = (distanceKm: number): number => {
    const baseTime = 15;
    const timePerKm = 5;
    return Math.round(baseTime + (distanceKm * timePerKm));
};

const RestaurantList: React.FC<RestaurantListProps> = ({restaurants}) => {
    const dispatch = useDispatch<AppDispatch>();
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);
    const handleRestaurantPress = useHandleRestaurantPress();

    const selectedAddressID = useSelector((state: RootState) => state.address.selectedAddressId);
    const selectedAddress = useSelector((state: RootState) =>
        state.address.addresses.find((address) => address.id === selectedAddressID?.toString())
    );

    const handleFavoritePress = useCallback((id: number) => {
        const token = tokenService.getToken();
        if (!token) {
            console.error('Authentication token is missing.');
            return;
        }
        if (favoriteRestaurantsIDs.includes(id)) {
            dispatch(removeFavoriteThunk({restaurant_id: id}));
        } else {
            dispatch(addFavoriteThunk({restaurant_id: id}));
        }
    }, [dispatch, favoriteRestaurantsIDs]);

    const renderRestaurantItem = ({item}: { item: Restaurant }) => {
        const isFavorite = favoriteRestaurantsIDs.includes(item.id);
        const isOpen = isRestaurantOpen(item.workingDays, item.workingHoursStart, item.workingHoursEnd);
        const hasStock = item.listings > 0;

        const distance = selectedAddress?.latitude && selectedAddress?.longitude && item.latitude && item.longitude
            ? calculateDistanceToRestaurant(
                selectedAddress.latitude,
                selectedAddress.longitude,
                item.latitude,
                item.longitude
            )
            : null;

        const deliveryTime = distance ? calculateDeliveryTime(distance) : 35;
        const distanceDisplay = distance
            ? distance < 1
                ? `${Math.round(distance * 1000)}m away`
                : `${distance.toFixed(1)} km away`
            : 'Distance unavailable';

        const isDisabled = !isOpen || !hasStock;
        const overlayMessage = !isOpen
            ? 'Currently Closed'
            : !hasStock
                ? 'Out of Stock (Come back later!)'
                : '';

        return (
            <TouchableOpacity
                onPress={() => !isDisabled && handleRestaurantPress(item.id)}
                activeOpacity={isDisabled ? 1 : 0.95}
                style={styles.touchableContainer}
            >
                <View style={styles.restaurantCard}>
                    {item.image_url ? (
                        <Image
                            source={{uri: item.image_url}}
                            style={styles.image}
                        />
                    ) : (
                        <View style={[styles.image, styles.placeholderImage]}>
                            <MaterialIcons name="restaurant" size={48} color="#DDDDDD"/>
                        </View>
                    )}

                    {isDisabled && (
                        <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{overlayMessage}</Text>
                        </View>
                    )}

                    {item.category && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => handleFavoritePress(item.id)}
                    >
                        <View style={styles.heartBackground}>
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={isFavorite ? "#FF4081" : "#757575"}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.contentContainer}>
                        <View style={styles.headerRow}>
                            <Text style={styles.title} numberOfLines={1}>
                                {item.restaurantName || 'Unnamed Restaurant'}
                            </Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#50703C"/>
                                <Text style={styles.rating}>{(item.rating ?? 0).toFixed(1)}</Text>
                                <Text style={styles.reviewCount}>({item.ratingCount ?? 0}+)</Text>
                            </View>
                        </View>

                        <Text style={styles.description} numberOfLines={2}>
                            {item.restaurantDescription || 'No description available'}
                        </Text>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <MaterialCommunityIcons name="map-marker-distance" size={18} color="#50703C"/>
                                <Text style={styles.infoText}>{distanceDisplay}</Text>
                            </View>

                            {item.delivery && (
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="delivery-dining" size={18} color="#50703C"/>
                                    <Text style={styles.infoText}>{deliveryTime} min</Text>
                                </View>
                            )}

                            {item.pickup && (
                                <View style={styles.infoItem}>
                                    <MaterialCommunityIcons name="shopping-outline" size={18} color="#50703C"/>
                                    <Text style={styles.infoText}>Pickup</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.footer}>
                            {item.deliveryFee && item.delivery ? (
                                <View style={styles.footerItem}>
                                    <Text style={styles.footerLabel}>Delivery Fee:</Text>
                                    <Text style={styles.footerValue}>
                                        {item.deliveryFee > 0 ? `${item.deliveryFee.toFixed(2)} TL` : 'Free'}
                                    </Text>
                                </View>
                            ) : null}

                            {item.minOrderAmount && item.delivery ? (
                                <View style={styles.footerItem}>
                                    <Text style={styles.footerLabel}>Min Order:</Text>
                                    <Text style={styles.footerValue}>{item.minOrderAmount.toFixed(2)} TL</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={restaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 2,
        paddingBottom: 16,
        backgroundColor: "#fff",
    },
    touchableContainer: {
        marginVertical: 8,
        marginHorizontal: 4,
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 3},
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    restaurantCard: {
        overflow: "hidden",
        borderRadius: 16,
    },
    image: {
        position: "relative",
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },
    placeholderImage: {
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    overlayText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        padding: 16,
        fontFamily: "Poppins-SemiBold",
    },
    categoryBadge: {
        position: 'absolute',
        left: 12,
        top: 12,
        backgroundColor: 'rgba(80, 112, 60, 0.85)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: "Poppins-SemiBold",
    },
    heartButton: {
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 1,
    },
    heartBackground: {
        backgroundColor: "white",
        borderRadius: 50,
        padding: 8,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.15,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    contentContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginRight: 8,
        fontFamily: "Poppins-Bold",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#F0F9EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 2,
    },
    rating: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        fontFamily: "Poppins-SemiBold",
    },
    reviewCount: {
        fontSize: 12,
        color: "#666",
        fontFamily: "Poppins-Regular",
    },
    description: {
        color: "#6B7280",
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
        fontFamily: "Poppins-Regular",
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 8,
        gap: 12,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 4,
    },
    infoText: {
        fontSize: 14,
        color: "#4B5563",
        fontFamily: "Poppins-Regular",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    footerLabel: {
        fontSize: 13,
        color: "#6B7280",
        fontFamily: "Poppins-Regular",
    },
    footerValue: {
        fontSize: 13,
        fontWeight: "600",
        color: "#50703C",
        fontFamily: "Poppins-SemiBold",
    },
});

export default RestaurantList;