import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';
import {Ionicons} from '@expo/vector-icons';
import RestaurantHeader from "@/src/features/RestaurantScreen/components/RestaurantHeader";
import {RootStackParamList} from "@/src/utils/navigation";
import LocateToRestaurant from "@/src/features/RestaurantScreen/components/locateToRestaurant";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {getListingsThunk} from "@/src/redux/thunks/listingThunks";
import {Restaurant} from "@/src/redux/slices/restaurantSlice";
import {Listing} from "@/src/redux/slices/listingSlice";


const RestaurantDetails: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetails'>>();
    const [isMapActive, setIsMapActive] = useState(false); // Toggle map or details
    const [isPickup, setIsPickup] = useState(true); // Toggle Pickup/Delivery
    const bottomSheetRef = useRef<BottomSheet>(null);
    // These are your bottom sheet heights (snap points)
    const snapPoints = useMemo(() => ['30%', '30%', '80%'], []);

    if (!route.params || !route.params.restaurantId) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'red'}}>Error: Missing restaurantId.</Text>
            </View>
        );
    }

    // Only call the hook at the top level
    const dispatch = useDispatch<AppDispatch>();

    // If you have the user token in Redux, grab it here:
    // const token = useSelector((state: RootState) => state.user.token);

    // GET RESTAURANT ID & LOAD LISTINGS
    const {restaurantId} = route.params;
    const listings = useSelector((state: RootState) => state.listing.listings);

    useEffect(() => {
        const payload = {
            restaurantId: Number(restaurantId),
            page: 1,
            limit: 10,
        };
        dispatch(getListingsThunk(payload));
    }, [restaurantId, dispatch]);

    // GET RESTAURANT DATA
    const restaurant = useSelector((state: RootState) =>
        state.restaurant.restaurantsProximity.find(r => r.id === restaurantId)
    );

    const formatWorkingHours = (start: string, end: string) => {
        return `${start} - ${end}`;
    };

    if (!restaurant) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
                    Restaurant not found.
                </Text>
            </View>
        );
    }

    // Move renderListingItem outside the component’s nested hook calls
    const renderListingItem = ({item}: { item: Listing }) => {
        // Decide which price to show:
        const displayPrice = isPickup
            ? item.pickup_price ?? 0
            : item.delivery_price ?? 0;

        // Calculate discount if original price is present (calculate inline)
        let discountPercentage = 0;
        if (item.original_price && item.original_price > 0) {
            const diff = item.original_price - displayPrice;
            discountPercentage = Math.round((diff / item.original_price) * 100);
        }

        // Handler for adding to cart (dispatch must not be called inside the nested hook)
        const handleAddToCart = () => {
            // dispatch(addItemToCart({ listingId: item.id, count: 1, token }));
            console.log('Adding to cart: listingId=', item.id);
        };

        return (
            <View style={styles.listingItem}>
                {/* Listing Image */}
                {item.image_url ? (
                    <Image
                        source={{uri: item.image_url}}
                        style={styles.listingImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.listingImage, styles.noImage]}/>
                )}

                {/* Text Info */}
                <View style={styles.listingDetails}>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text style={styles.listingDescription}>{item.description}</Text>

                    {/* Price Row */}
                    <View style={styles.priceRow}>
                        {/* Original Price (strikethrough) */}
                        {item.original_price !== null && item.original_price > 0 && (
                            <Text style={styles.originalPrice}>
                                {item.original_price} TL
                            </Text>
                        )}

                        {/* Display Price */}
                        <Text style={styles.displayPrice}>
                            {displayPrice} TL
                        </Text>

                        {/* Discount */}
                        {discountPercentage > 0 && (
                            <View style={styles.discountContainer}>
                                <Text style={styles.discountText}>
                                    {discountPercentage}% OFF
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Add Button */}
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <RestaurantHeader
                isScrolled={true}
                restaurantName={restaurant.restaurantName.toString()}
                isMapActive={isMapActive}
                onToggleMap={setIsMapActive}
            />

            <ScrollView>
                {restaurant?.image_url ? (
                    <Image
                        source={{uri: restaurant.image_url}}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.headerNoImage}>
                        <Text style={styles.headerTitle}>
                            {restaurant?.restaurantName || 'Restaurant'}
                        </Text>
                    </View>
                )}

                {/* Show info only if user NOT toggled map */}
                {!isMapActive && (
                    <View style={styles.content}>
                        <Text style={styles.restaurantName}>
                            {restaurant.restaurantName}
                        </Text>

                        {/* Rating / Distance */}
                        <View style={styles.infoRow}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={20} color="#FFD700"/>
                                <Text style={styles.rating}>
                                    {(restaurant?.rating ?? 0).toFixed(1)}
                                </Text>
                                <Text style={styles.ratingCount}>
                                    ({restaurant?.ratingCount ?? 0})
                                </Text>
                            </View>
                            <Text style={styles.separator}>•</Text>
                            <Text style={styles.distance}>
                                {(restaurant?.distance_km ?? 0).toFixed(1)} km away
                            </Text>
                        </View>

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
                                    Hours: {formatWorkingHours(
                                    restaurant.workingHoursStart,
                                    restaurant.workingHoursEnd
                                )}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="calendar-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Open: {restaurant?.workingDays.join(', ')}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="location-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Location: {restaurant?.latitude.toFixed(6)}, {restaurant?.longitude.toFixed(6)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                style={styles.bottomSheet}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                handleIndicatorStyle={styles.bottomSheetHandle}
            >
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                    {/* Pickup / Delivery Toggle Buttons */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                isPickup && styles.activeButton,
                            ]}
                            onPress={() => setIsPickup(true)}
                        >
                            <Text
                                style={[
                                    styles.toggleButtonText,
                                    isPickup && styles.activeButtonText,
                                ]}
                            >
                                Pickup
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                !isPickup && styles.activeButton,
                            ]}
                            onPress={() => setIsPickup(false)}
                        >
                            <Text
                                style={[
                                    styles.toggleButtonText,
                                    !isPickup && styles.activeButtonText,
                                ]}
                            >
                                Delivery
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* List of items */}
                    {listings.length > 0 ? (
                        <FlatList
                            data={listings}
                            renderItem={renderListingItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    ) : (
                        <Text>No listings found.</Text>
                    )}
                </BottomSheetScrollView>
            </BottomSheet>

            {/* If user toggles map, show map */}
            {isMapActive && (
                <LocateToRestaurant restaurantId={restaurantId}/>
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
    bottomSheet: {
        zIndex: 3,
    },
    bottomSheetContent: {
        padding: 16,
    },
    bottomSheetHandle: {
        backgroundColor: '#ccc',
        width: 40,
        height: 5,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginVertical: 8,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    toggleButtonText: {
        fontSize: 16,
        color: '#333',
    },
    activeButton: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    activeButtonText: {
        color: '#FFF',
    },
    listingItem: {
        flexDirection: 'row',
        marginVertical: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#FFF',
        alignItems: 'center',
        // shadow for iOS, elevation for Android
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    listingImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    noImage: {
        backgroundColor: '#ccc',
    },
    listingDetails: {
        flex: 1,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    listingDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
        textDecorationLine: 'line-through',
    },
    displayPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    discountContainer: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: '#EBF9ED',
        borderRadius: 4,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#34A853',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    addButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '600',
    },
});
