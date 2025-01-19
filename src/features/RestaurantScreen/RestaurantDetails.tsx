import React from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {useSelector} from 'react-redux';
import CartBar from "@/src/features/RestaurantScreen/components/cartBar";
import RestaurantInfoSection from "@/src/features/RestaurantScreen/components/RestaurantInfoSection";
import ListingsCard from "@/src/features/RestaurantScreen/components/listingsCard";
import {RootState} from "@/src/types/store";


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
        flex: 1,
        marginTop: 16, // Add some spacing between restaurant info and listings
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


});
