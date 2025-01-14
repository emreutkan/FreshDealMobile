import React, {useState} from "react";
import {Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import PickUpDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";
import {GoBackButton} from "@/src/features/RestaurantScreen/components/RestaurantHeader";
import LocateToRestaurant from "@/src/features/RestaurantScreen/components/locateToRestaurant";

interface RestaurantInfoSectionParams {
    restaurant: any;
    isPickup: boolean;
    setIsPickup: (pickup: boolean) => void;
    pickupAvailable: boolean;
    deliveryAvailable: boolean;
}

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

const RestaurantInfoSection: React.FC<RestaurantInfoSectionParams> = ({
                                                                          restaurant,
                                                                          isPickup,
                                                                          setIsPickup,
                                                                          pickupAvailable,
                                                                          deliveryAvailable,
                                                                      }) => {
    const [showInfoModal, setShowInfoModal] = useState(false);

    // optional detail toggle from original code
    const [viewDetails, setViewDetails] = React.useState(false);

    const formatWorkingHours = (start: string, end: string) => {
        return `${start} - ${end}`;
    };

    return (
        <View style={{flex: 1}}>
            {/* Scrollable wrapper */}
            <View
                style={{
                    bottom: 20,
                }}
                contentContainerStyle={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >

                {restaurant?.image_url ? (
                    <Image
                        source={{uri: restaurant.image_url}}
                        style={{
                            width: "100%",
                            height: 200,
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.headerNoImage}>
                        <Text style={styles.headerTitle}>
                            {restaurant?.restaurantName || "Restaurant"}
                        </Text>
                    </View>
                )}
                <GoBackButton/>

                {/* Title + Ionicon row */}
                <View
                    style={{
                        padding: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <View style={styles.titleRow}>
                        <Text style={styles.mainRestaurantTitle}>
                            {restaurant?.restaurantName || "Restaurant"}
                        </Text>
                        <TouchableOpacity
                            style={styles.infoIconContainer}
                            onPress={() => setShowInfoModal(true)}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={30}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Rating + distance */}
                    <View style={styles.ratingDistanceRow}>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={20} color="#ACF283"/>
                            <Text style={styles.ratingNumber}>
                                {(restaurant?.rating ?? 0).toFixed(1)}
                            </Text>
                            <Text style={styles.ratingCount}>
                                ({restaurant?.ratingCount ?? 0}+)
                            </Text>
                        </View>
                        <Text style={styles.separator}>•</Text>
                        <Text style={styles.distance}>
                            {(restaurant?.distance_km ?? 0).toFixed(1)} km
                        </Text>
                    </View>

                    {/* Pickup/Delivery Toggle */}
                    <View style={{paddingVertical: 8}}>
                        <PickUpDeliveryToggle
                            isPickup={isPickup}
                            setIsPickup={setIsPickup}
                            pickupAvailable={pickupAvailable}
                            deliveryAvailable={deliveryAvailable}
                        />
                    </View>

                    {/* Pricing and fees section */}
                    <View style={styles.pricingContainer}>
                        <View style={styles.pricingColumn}>
                            <Text style={styles.pricingHeader}>Pricing and fees</Text>
                            <Text style={styles.pricingValue}>{restaurant?.deliveryFee ?? "N/A"} TL</Text>
                        </View>
                        <View style={styles.divider}/>
                        <View style={styles.pricingColumn}>
                            <Text style={styles.pricingHeader}>Pick-up time</Text>
                            <Text style={styles.pickupTimes}>
                                <Ionicons name="walk-outline"
                                          size={16}/> {getWalkingTime(restaurant?.distance_km ?? 0)} min walking
                            </Text>
                            <Text style={styles.pickupTimes}>
                                <Ionicons name="car-outline"
                                          size={16}/> {getDrivingTime(restaurant?.distance_km ?? 0)} min drive
                            </Text>
                        </View>
                    </View>

                </View>

                {/* Optional "View Details" section from original code */}
                <View style={{width: "90%", marginBottom: 40}}>
                    {viewDetails && (
                        <View style={styles.detailsSection}>
                            <Text style={styles.sectionTitle}>Details</Text>

                            <View style={styles.detailRow}>
                                <Ionicons name="reader-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    About: {restaurant.restaurantDescription}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="restaurant-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Category: {restaurant.category}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="time-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Hours:{" "}
                                    {formatWorkingHours(
                                        restaurant.workingHoursStart,
                                        restaurant.workingHoursEnd
                                    )}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="calendar-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Open: {restaurant?.workingDays.join(", ")}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="location-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Location: {restaurant?.latitude.toFixed(6)},{" "}
                                    {restaurant?.longitude.toFixed(6)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>

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
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                        }}>
                            <Text style={styles.modalTitle}>Restaurant Info</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowInfoModal(false)}
                            >
                                <Text style={{color: "#fff"}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            marginBottom: 10,
                        }}>
                            <Text style={{marginBottom: 10, color: "#333"}}>
                                {restaurant?.restaurantDescription || "No info available."}
                            </Text>
                            <Text style={{marginBottom: 10, color: "#333"}}>
                                Category: {restaurant?.category || "N/A"}
                            </Text>
                            <Text style={{marginBottom: 10, color: "#333"}}>
                                Working hours:{" "}
                                {formatWorkingHours(
                                    restaurant?.workingHoursStart || "",
                                    restaurant?.workingHoursEnd || ""
                                )}
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            width: "100%",
                            backgroundColor: "#f5f5f5",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}>
                            <LocateToRestaurant restaurantId={restaurant.id}/>
                        </View>
                    </View>
                </View>
            </Modal>


        </View>
    );
};

export default RestaurantInfoSection;

const styles = StyleSheet.create({
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
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    mainRestaurantTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        fontFamily: "Poppins-Regular",
    },
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
    ratingCount: {
        fontSize: 14,
        color: "#666",
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
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    detailText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 8,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    backdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
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
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        backgroundColor: "#333",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    restaurantDetails: {
        flex: 1,
        marginBottom: 10,
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        overflow: "hidden", // Ensures map content stays within boundaries
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
