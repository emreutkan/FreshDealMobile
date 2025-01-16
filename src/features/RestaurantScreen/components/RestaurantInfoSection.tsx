import React, {useState} from "react";
import {Dimensions, Image, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import PickUpDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";
import LocateToRestaurant from "@/src/features/RestaurantScreen/components/locateToRestaurant";
import {LinearGradient} from "expo-linear-gradient";
import GoBack from "@/src/features/homeScreen/components/goBack";

interface RestaurantInfoSectionParams {
    restaurant: any;
    isPickup: boolean;
    setIsPickup: (pickup: boolean) => void;
    pickupAvailable: boolean;
    deliveryAvailable: boolean;
    children?: React.ReactNode;
}


const RestaurantInfoSection: React.FC<RestaurantInfoSectionParams> = ({
                                                                          restaurant,
                                                                          isPickup,
                                                                          setIsPickup,
                                                                          pickupAvailable,
                                                                          deliveryAvailable,
                                                                          children
                                                                      }) => {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const {height: screenHeight} = Dimensions.get("window");

// helper functions for walking / driving times
    function getWalkingTime(distance_km: number) {
        // ~5 km/h => distance_km * 12 = minutes
        return Math.round(distance_km * 12);
    }

    function getDrivingTime(distance_km: number) {
        // ~30 km/h => distance_km * 2 = minutes
        return Math.round(distance_km * 2);
    }

    // optional detail toggle from original code
    const [viewDetails, setViewDetails] = React.useState(false);

    const formatWorkingHours = (start: string, end: string) => {
        return `${start} - ${end}`;
    };


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"/>

            {/* Restaurant Image */}
            <View style={styles.imageContainer}>
                {restaurant?.image_url ? (
                    <>
                        <Image
                            source={{uri: restaurant.image_url}}
                            style={styles.restaurantImage}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.imageOverlay}
                        />
                    </>
                ) : (
                    <View style={styles.noImageContainer}>
                        <Ionicons
                            name="restaurant-outline"
                            size={48}
                            color="#CCCCCC"
                            style={styles.noImageIcon}
                        />
                        <Text style={styles.noImageText}>
                            No image available
                        </Text>
                    </View>
                )}
                <GoBack/>
            </View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Title Section */}
                <View style={styles.titleRow}>
                    <Text style={styles.mainRestaurantTitle} numberOfLines={1}>
                        {restaurant?.restaurantName || "Restaurant"}
                    </Text>
                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => setShowInfoModal(true)}
                    >
                        <Ionicons name="information-circle-outline" size={24} color="#666666"/>
                    </TouchableOpacity>
                </View>

                {/* Rating & Distance */}
                <View style={styles.ratingContainer}>
                    <View style={styles.ratingBox}>
                        <Ionicons name="star" size={18} color="#FFD700"/>
                        <Text style={styles.ratingText}>
                            {(restaurant?.rating ?? 0).toFixed(1)}
                        </Text>
                        <Text style={styles.ratingCount}>
                            ({restaurant?.ratingCount ?? 0}+)
                        </Text>
                    </View>
                    <View style={styles.distanceBox}>
                        <Text style={styles.distanceText}>
                            {(restaurant?.distance_km ?? 0).toFixed(1)} km
                        </Text>
                    </View>
                </View>

                {/* Pickup/Delivery Toggle */}
                <PickUpDeliveryToggle
                    isPickup={isPickup}
                    setIsPickup={setIsPickup}
                    pickupAvailable={pickupAvailable}
                    deliveryAvailable={deliveryAvailable}
                />

                {/* Info Cards */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Delivery Information</Text>
                    <View style={styles.timeRow}>
                        <View style={styles.timeIcon}>
                            <Ionicons name="walk-outline" size={20} color="#666666"/>
                        </View>
                        <Text style={styles.timeText}>
                            {getWalkingTime(restaurant?.distance_km ?? 0)} min walking
                        </Text>
                    </View>
                    <View style={styles.timeRow}>
                        <View style={styles.timeIcon}>
                            <Ionicons name="car-outline" size={20} color="#666666"/>
                        </View>
                        <Text style={styles.timeText}>
                            {getDrivingTime(restaurant?.distance_km ?? 0)} min driving
                        </Text>
                    </View>
                </View>
            </View>
            {children}

            {/* Info Modal */}
            <Modal
                transparent
                visible={showInfoModal}
                animationType="slide"
                onRequestClose={() => setShowInfoModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        onPress={() => setShowInfoModal(false)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Restaurant Info</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowInfoModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalInfoSection}>
                            <Text style={styles.modalInfoText}>
                                {restaurant?.restaurantDescription || "No info available."}
                            </Text>
                            <Text style={styles.modalInfoText}>
                                Category: {restaurant?.category || "N/A"}
                            </Text>
                            <Text style={styles.modalInfoText}>
                                Working hours:{" "}
                                {formatWorkingHours(
                                    restaurant?.workingHoursStart || "",
                                    restaurant?.workingHoursEnd || ""
                                )}
                            </Text>
                        </View>

                        <View style={styles.mapContainer}>
                            <LocateToRestaurant restaurantId={restaurant.id}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalContent: {
        width: "100%",
        height: "85%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#333",
    },
    closeButton: {
        backgroundColor: "#333",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    modalInfoSection: {
        marginBottom: 20,
    },
    modalInfoText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 12,
        lineHeight: 24,
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        overflow: "hidden",
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        width: '100%',
        height: 240,
        backgroundColor: '#f5f5f5',
        position: 'relative',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(0,0,0,0.3)',

    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    mainRestaurantTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
    },
    infoButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginLeft: 4,
    },
    ratingCount: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 4,
    },
    distanceBox: {
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
    },
    distanceText: {
        fontSize: 14,
        color: '#666666',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    timeText: {
        fontSize: 15,
        color: '#666666',
    },

    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    detailIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailText: {
        flex: 1,
        fontSize: 15,
        color: '#666666',
    },
    headerNoImage: {
        width: "100%",
        height: 150,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: "Poppins-Regular",
        fontSize: 18,
        color: "#333",
    },
    // Title row with icon

    infoIconContainer: {
        marginLeft: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    ratingDistanceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingNumber: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 4,
    },

    separator: {
        marginHorizontal: 8,
        color: "#666",
    },
    distance: {
        fontSize: 14,
        color: "#666",
    },
    pricingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    pricingFees: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    pricingSeparator: {
        marginHorizontal: 8,
        color: "#666",
    },
    pickupTime: {
        fontSize: 14,
        color: "#666",
    },
    detailsSection: {
        backgroundColor: "#f9f9f9",
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },


    restaurantDetails: {
        flex: 1,
        marginBottom: 10,
    },


    pricingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        width: "90%",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    pricingColumn: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    pricingHeader: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 4,
    },
    pricingValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    divider: {
        width: 1,
        height: "80%",
        backgroundColor: "#ddd",
        marginHorizontal: 8,
    },
    pickupTimes: {
        fontSize: 14,
        color: "#333",
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
    },


});
export default RestaurantInfoSection;

