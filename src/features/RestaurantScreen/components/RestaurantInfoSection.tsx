import React, {useState} from "react";
import {Image, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import LocateToRestaurant from "@/src/features/RestaurantScreen/components/locateToRestaurant";
import {LinearGradient} from "expo-linear-gradient";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import PickUpDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";
import {useSelector} from "react-redux";
import {RootState} from "@/src/types/store";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const RestaurantInfoSection: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [showInfoModal, setShowInfoModal] = useState(false);
    const restaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
    console.log("the restaurant that restaurantinfo sees", restaurant);
    const InformationMapModal = () => {
        return (
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

                        <View style={{
                            marginBottom: 20,

                        }}>
                            <Text style={styles.modalInfoText}>
                                {restaurant?.restaurantDescription || "No info available."}
                            </Text>
                            <Text style={styles.modalInfoText}>
                                <Text style={{fontFamily: "Poppins-SemiBold"}}>Category: </Text>

                                {restaurant?.category || "N/A"}
                            </Text>
                            <Text style={styles.modalInfoText}>
                                <Text style={{fontFamily: "Poppins-SemiBold"}}>Working Hours: </Text>
                                {formatWorkingHours(
                                    restaurant?.workingHoursStart || "",
                                    restaurant?.workingHoursEnd || ""
                                )}
                            </Text>
                            {restaurant.delivery && (
                                <Text style={styles.modalInfoText}>
                                    <Text style={{fontFamily: "Poppins-SemiBold"}}>Delivery Fee: </Text>
                                    {`${restaurant?.deliveryFee || 0}${'\u20BA'}`}
                                </Text>
                            )}


                        </View>

                        <View style={styles.mapContainer}>
                            <LocateToRestaurant/>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

// helper functions for walking / driving times
    function getWalkingTime(distance_km: number) {
        // ~5 km/h => distance_km * 12 = minutes
        return Math.round(distance_km * 12);
    }

    function getDrivingTime(distance_km: number) {
        if (distance_km < 1.5) {
            return 1;
        }
        return Math.round(distance_km * 2);
    }


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
                        />
                        <Text style={styles.noImageText}>
                            No image available
                        </Text>
                    </View>
                )}
                <GoBackIcon/>
            </View>

            <View style={styles.contentContainer}>
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
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 16,

                    }}
                >

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
                    <TouchableOpacity
                        style={styles.distanceBox}
                        onPress={() => navigation.navigate('RestaurantComments')}
                    >
                        <Text style={styles.distanceText}>
                            Comments
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* Info Cards */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Delivery Information</Text>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                        <View>
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

                        <PickUpDeliveryToggle

                        />
                    </View>
                    {/* Pickup/Delivery Toggle */}

                </View>

            </View>
            <InformationMapModal/>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',

    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    noImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        marginTop: 8,
        color: '#666666',
        fontFamily: "Poppins-Regular",
    },
    contentContainer: {
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
        fontFamily: "Poppins-SemiBold",
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
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginLeft: 4,
    },
    ratingCount: {
        fontFamily: "Poppins-Regular",
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
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        color: '#666666',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
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
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
        paddingHorizontal: 2,
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
        fontFamily: "Poppins-Regular",
        fontSize: 15,
        color: '#666666',
    },
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
        fontFamily: "Poppins-Regular",
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
        fontFamily: "Poppins-Regular",

    },

    modalInfoText: {
        fontFamily: "Poppins-Regular",
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


});
export default RestaurantInfoSection;

