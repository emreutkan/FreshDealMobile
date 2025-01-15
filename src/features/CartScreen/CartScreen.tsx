import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';
import ListingCard from "@/src/features/RestaurantScreen/components/listingsCard";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "@/src/utils/navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import GoBackIcon from "@/src/features/homeScreen/components/goBackIcon";
import {scaleFont} from "@/src/utils/ResponsiveFont";


const CartScreen: React.FC = () => {

    // Only call the hook at the top level
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute<RouteProp<RootStackParamList, 'Cart'>>();
    const {isPickup, setIsPickup} = route.params;

    const cart = useSelector((state: RootState) => state.cart.cartItems);
    const listings = useSelector((state: RootState) => state.listing.listings);
    const ListingsInCart = listings.filter(listing => cart.some(cartItem => cartItem.listing_id));

    const insets = useSafeAreaInsets();


    return (
        <View style={
            {
                ...styles.container,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }
        }>
            <GoBackIcon></GoBackIcon>
            <View
                style={{
                    alignItems: 'center',

                }}
            >

            </View>
            <ScrollView
                style={{
                    flex: 1,
                    padding: scaleFont(16),
                    backgroundColor: '#f9f9f9',
                }}
            >

                <ListingCard listingList={ListingsInCart} isPickup={isPickup}/>

            </ScrollView>
        </View>
    );


};

export default CartScreen;

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
    content: {
        padding: 16,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
