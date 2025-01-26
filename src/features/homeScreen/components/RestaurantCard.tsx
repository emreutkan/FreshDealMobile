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

interface RestaurantListProps {
    restaurants: Restaurant[];
}

// Helper function to calculate distance between two coordinates
const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

// Helper function to check if restaurant is open
const isRestaurantOpen = (
    workingDays: string[],
    workingHoursStart?: string,
    workingHoursEnd?: string
): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', {weekday: 'long'});
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    console.log('Current day:', currentDay);
    console.log('Current time:', currentHour, currentMinute);
    console.log('Working days:', workingDays);
    console.log('Working hours:', workingHoursStart, workingHoursEnd);
    if (!workingDays.includes(currentDay)) return false;

    if (workingHoursStart && workingHoursEnd) {
        const [startHour, startMinute] = workingHoursStart.split(':').map(Number);
        const [endHour, endMinute] = workingHoursEnd.split(':').map(Number);

        const currentTime = currentHour * 60 + currentMinute;
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        return currentTime >= startTime && currentTime <= endTime;
    }


    return true;
};

// Calculate estimated delivery time based on distance
const calculateDeliveryTime = (distanceKm: number): number => {
    const baseTime = 15; // Base preparation time in minutes
    const timePerKm = 5; // Additional minutes per kilometer
    return Math.round(baseTime + (distanceKm * timePerKm));
};

const RestaurantList: React.FC<RestaurantListProps> = ({restaurants}) => {
    const dispatch = useDispatch<AppDispatch>();
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);
    const handleRestaurantPress = useHandleRestaurantPress();

    const selectedAddressID = useSelector((state: RootState) => state.address.selectedAddressId);
    const selectedAddress = useSelector((state: RootState) =>
        state.address.addresses.find((address) => address.id === selectedAddressID)
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

        // Calculate distance if we have coordinates
        const distance = selectedAddress?.latitude && selectedAddress?.longitude && item.latitude && item.longitude
            ? calculateDistance(
                selectedAddress.latitude,
                selectedAddress.longitude,
                item.latitude,
                item.longitude
            )
            : null;

        const deliveryTime = distance ? calculateDeliveryTime(distance) : 35;
        const distanceDisplay = distance
            ? distance < 1
                ? `Within ${Math.round(distance * 1000)}m`
                : `Within ${distance.toFixed(1)} km`
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
                    {item.image_url && (
                        <Image
                            source={{
                                uri: item.image_url,
                            }}
                            style={styles.image}
                        />
                    )

                    }

                    {isDisabled && (
                        <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{overlayMessage}</Text>
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
                                <Ionicons name="star" size={16} color="#4CAF50"/>
                                <Text style={styles.rating}>{(item.rating ?? 0).toFixed(1)}</Text>
                                <Text style={styles.reviewCount}>({item.ratingCount ?? 0}+)</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.locationContainer}>
                                <MaterialCommunityIcons name="run-fast" size={20} color="#50703C"/>
                                <Text
                                    style={styles.locationText}>{distanceDisplay}</Text>
                            </View>
                        </View>

                        {item.delivery && (
                            <View style={styles.deliveryInfoContainer}>
                                <View style={styles.timeAndPrice}>
                                    <MaterialIcons name="delivery-dining" size={24} color="#50703C"/>
                                    <Text style={styles.deliveryText}>{deliveryTime} min</Text>
                                    <Text style={styles.dot}>•</Text>
                                    <Text style={styles.priceText}>
                                        {item.deliveryFee ? `${item.deliveryFee.toFixed(2)}TL` : 'Free Delivery'}
                                    </Text>
                                </View>
                            </View>
                        )}
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
    // ... existing styles ...
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        padding: 16,
        fontFamily: "Poppins-SemiBold",
    },
    minOrderText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontFamily: "Poppins-Regular",

    },
    listContainer: {
        backgroundColor: "#fff",
    },
    touchableContainer: {

        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    restaurantCard: {

        overflow: "hidden",
        borderRadius: 12,
    },
    image: {
        position: "relative",
        width: "100%",
        height: 160,
        resizeMode: "cover",
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
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
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
        fontWeight: "600",
        color: "#000",
        marginRight: 8,
        fontFamily: "Poppins-Regular",
        paddingBottom: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    rating: {
        fontFamily: "Poppins-Regular",

        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    reviewCount: {
        fontFamily: "Poppins-Regular",

        fontSize: 14,
        color: "#666",
    },
    infoRow: {
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    locationText: {
        fontFamily: "Poppins-Regular",

        fontSize: 14,
        color: "#666",
    },
    deliveryInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeAndPrice: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    deliveryText: {
        fontFamily: "Poppins-Regular",

        fontSize: 14,
        color: "#666",
    },
    dot: {
        fontFamily: "Poppins-Regular",

        fontSize: 14,
        color: "#666",
        marginHorizontal: 1,
    },
    priceText: {
        fontFamily: "Poppins-Regular",

        fontSize: 14,
        color: "#666",
    },

});

export default RestaurantList;