import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';
import {RootStackParamList} from "@/src/utils/navigation";
import {getListingsThunk} from "@/src/redux/thunks/listingThunks";
import RestaurantInfoSection from "@/src/features/RestaurantScreen/components/RestaurantInfoSection";
import ListingsCard from "@/src/features/RestaurantScreen/components/listingsCard";
import CartBar from "@/src/features/RestaurantScreen/components/cartBar";


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
                    <RestaurantInfoSection restaurant={restaurant}
                                           isPickup={isPickup}
                                           setIsPickup={setIsPickup}
                                           pickupAvailable={pickupAvailable}
                                           deliveryAvailable={deliveryAvailable}
                    />

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
                {cartItems && cartItems.length > 0 && (
                    <CartBar
                        restaurantId={restaurantId}
                        isPickup={isPickup}
                        setIsPickup={setIsPickup}
                        cartItems={cartItems}
                    />
                )}
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
});
