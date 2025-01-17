import React from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/redux/store';
import CartBar from "@/src/features/RestaurantScreen/components/cartBar";
import RestaurantInfoSection from "@/src/features/RestaurantScreen/components/RestaurantInfoSection";
import ListingsCard from "@/src/features/RestaurantScreen/components/listingsCard";


const RestaurantDetails: React.FC = () => {

    // Move all useSelector calls to the top level
    const cart = useSelector((state: RootState) => state.cart);
    const listings = useSelector((state: RootState) => state.restaurant.selectedRestaurantListings);


    return (
        <View style={styles.container}>
            <RestaurantInfoSection/>

            <View style={styles.listingsContainer}>
                {listings.length > 0 ? (
                    <ListingsCard/>
                ) : (
                    <Text>No listings found.</Text>
                )}
            </View>

            {cart.cartItems.length > 0 && (
                <CartBar/>
            )}
        </View>
    );

};

export default RestaurantDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listingsContainer: {
        flex: 1 / 2,
        marginTop: 16, // Add some spacing between restaurant info and listings
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
