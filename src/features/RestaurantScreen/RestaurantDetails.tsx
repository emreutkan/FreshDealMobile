import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';
import {RootStackParamList} from "@/src/utils/navigation";
import {getListingsThunk} from "@/src/redux/thunks/listingThunks";
import ListingsCard from "@/src/features/RestaurantScreen/components/listingsCard";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {GoBackButton} from "@/src/features/RestaurantScreen/components/RestaurantHeader";
import {Ionicons} from "@expo/vector-icons";
import PickUpDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";
import LocateToRestaurant from "@/src/features/RestaurantScreen/components/locateToRestaurant";


const RestaurantDetails: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetails'>>();
    const [isMapActive, setIsMapActive] = useState(false); // Toggle map or details
    const [isPickup, setIsPickup] = useState(true); // Toggle Pickup/Delivery

    const cart = useSelector((state: RootState) => state.cart);

    if (!route.params || !route.params.restaurantId) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'red'}}>Error: Missing restaurantId.</Text>
            </View>
        );
    }
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
    // Only call the hook at the top level
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const {restaurantId} = route.params;
    const listings = useSelector((state: RootState) => state.listing.listings);
    useEffect(() => {
        const payload = {
            restaurantId: Number(restaurantId),
            page: 1,
            limit: 10,
        };
        dispatch(getListingsThunk(payload));
        // dispatch(fetchCart());
    }, [restaurantId, dispatch, isPickup,
        // cartItems
    ]);

    const CartBar: React.FC = () => {

        type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
        const navigation = useNavigation<NavigationProp>();


        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    backgroundColor: '#b2f7a5', // You can change this color to match your branding
                    paddingVertical: 15,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5, // Add shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                }}
                onPress={handleGoToCart}
            >
                <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                }}>
                    {`Click to Go To Cart (${cartItems.length} item${cartItems.length > 1 ? 's' : ''})`}
                </Text>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        console.log("Cart updated: ", cart);
    }, [cart]);
    // GET RESTAURANT DATA
    const restaurant = useSelector((state: RootState) =>
        state.restaurant.restaurantsProximity.find(r => r.id === restaurantId)
    );


    if (!restaurant) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
                    Restaurant not found.
                </Text>
            </View>
        );
    } else {
        const pickupAvailable = restaurant.pickup;
        const deliveryAvailable = restaurant.delivery;
        return (
            <>
                {/*<RestaurantHeader*/}
                {/*    isScrolled={true}*/}
                {/*    restaurantName={restaurant.restaurantName.toString()}*/}
                {/*    isMapActive={isMapActive}*/}
                {/*    onToggleMap={setIsMapActive}*/}
                {/*    restaurantId={restaurantId}*/}
                {/*    isPickup={isPickup}*/}
                {/*    setIsPickup={setIsPickup}*/}
                {/*/>*/}

                <View style={styles.container}>
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
                                                      size={16}/> {getWalkingTime(restaurant?.distance_km ?? 0)} min
                                            walking
                                        </Text>
                                        <Text style={styles.pickupTimes}>
                                            <Ionicons name="car-outline"
                                                      size={16}/> {getDrivingTime(restaurant?.distance_km ?? 0)} min
                                            drive
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

                    {listings.length > 0 ? (
                        <ListingsCard listingList={listings} isPickup={isPickup}/>

                    ) : (
                        <Text>No listings found.</Text>
                    )

                    }

                    {/*{isMapActive && (*/}
                    {/*    <LocateToRestaurant restaurantId={restaurantId}/>*/}
                    {/*)}*/}
                </View>

            </>
        );
    }


};

export default RestaurantDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',

    },
    headerImage: {
        width: '100%',
        height: 200,

    },
    headerNoImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },


    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    ratingCount: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    separator: {
        marginHorizontal: 8,
        color: '#666',
    },
    distance: {
        fontSize: 14,
        color: '#666',
    },
    detailsSection: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
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
