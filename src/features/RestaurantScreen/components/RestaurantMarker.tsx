import {Image, StyleSheet, Text, View} from "react-native";
import {Marker} from "react-native-maps";
import React, {useMemo, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {Restaurant} from "@/src/types/api/restaurant/model"; // Adjust the import path as needed

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

export const RestaurantMarker: React.FC<{
    restaurant: Restaurant;
    isSelected: boolean;
    onPress: () => void;
}> = React.memo(({restaurant, isSelected, onPress}) => {
    const [imageError, setImageError] = useState(false);

    const isAvailable = useMemo(() => {
        const isOpen = isRestaurantOpen(
            restaurant.workingDays,
            restaurant.workingHoursStart,
            restaurant.workingHoursEnd
        );
        const hasStock = restaurant.listings > 0;
        return isOpen && hasStock;
    }, [restaurant]);

    const getUnavailableReason = () => {
        if (!isRestaurantOpen(
            restaurant.workingDays,
            restaurant.workingHoursStart,
            restaurant.workingHoursEnd
        )) {
            return 'Closed';
        }
        if (restaurant.listings <= 0) {
            return 'Out of Stock';
        }
        return '';
    };

    return (
        <Marker
            coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
            }}
            onPress={() => isAvailable && onPress()}
            tracksViewChanges={false}
        >
            <View
                style={[
                    styles.markerContainer,
                    isSelected && styles.selectedMarker,
                    !isAvailable && styles.unavailableMarker,
                ]}
            >
                {restaurant.image_url && !imageError ? (
                    <Image
                        source={{
                            uri: restaurant.image_url
                        }}
                        style={[
                            styles.markerImage,
                            !isAvailable && styles.unavailableImage
                        ]}
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View style={[
                        styles.defaultMarkerContainer,
                        !isAvailable && styles.unavailableMarker
                    ]}>
                        <Ionicons
                            name="restaurant-outline"
                            size={30}
                            color={!isAvailable ? "#999" : "#333"}
                        />
                    </View>
                )}
                {!isAvailable && (
                    <View style={styles.unavailableLabel}>
                        <Text style={styles.unavailableLabelText}>
                            {getUnavailableReason()}
                        </Text>
                    </View>
                )}
            </View>
        </Marker>
    );
});

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },

    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto', // This pushes the button to the right
        padding: 8,
    },

    menuButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
        fontFamily: 'Poppins-SemiBold',
    },

    restaurantInfoContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
    },

    bottomSheetContent: {
        padding: 12,
    },

    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    basicInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#333',
    },
    distanceText: {
        fontSize: 12,
        color: '#666',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    relocateButton: {
        position: 'absolute',
        bottom: 150,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1,
    },
    markerContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    selectedMarker: {
        borderColor: '#B2F7A5FF',
        borderWidth: 3,
        transform: [{scale: 1.1}],
    },
    markerImage: {
        width: '100%',
        height: '100%',
    },
    defaultMarkerContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    noRestaurantsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    messageBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        alignItems: 'center'
    },
    noRestaurantsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF5A5F',
        marginBottom: 12,
        letterSpacing: 0.5,
        fontFamily: 'Poppins-Regular',
    },
    noRestaurantsMessage: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#484848',
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.3,
    },


    detailsContainer: {
        padding: 16,
    },

    restaurantDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
    },

    deliveryInfoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    deliveryText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    unavailableMarker: {
        opacity: 0.7,
        borderColor: '#ccc',
    },
    unavailableImage: {
        opacity: 0.7,
    },
    unavailableLabel: {
        position: 'absolute',
        bottom: -20,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
        alignItems: 'center',
    },
    unavailableLabelText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },

});
