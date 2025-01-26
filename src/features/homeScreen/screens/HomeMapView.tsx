import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";
import {getRestaurantsByProximity, getRestaurantThunk} from "@/src/redux/thunks/restaurantThunks";
import {strongHaptic} from "@/src/utils/Haptics";
import MapView, {Marker} from "react-native-maps";
import {Address} from "@/src/types/api/address/model";
import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {setSelectedRestaurant} from "@/src/redux/slices/restaurantSlice";
import {RestaurantMarker} from "@/src/features/RestaurantScreen/components/RestaurantMarker";
import {RootStackParamList} from "@/src/utils/navigation";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";
import {Restaurant} from "@/src/types/api/restaurant/model";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeMapView: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);  // Reference for the bottom sheet
    const [isMapReady, setIsMapReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
    const snapPoints = useMemo(() => [200], []);
    const navigation = useNavigation<NavigationProp>();
    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity);
    const addressState = useSelector((state: RootState) => state.address);
    const selectedAddress = addressState.addresses.find(
        (address) => address.id === addressState.selectedAddressId
    ) as Address;
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

// Helper function to check if restaurant is available
    const isRestaurantAvailable = (restaurant: Restaurant): boolean => {
        const isOpen = isRestaurantOpen(
            restaurant.workingDays,
            restaurant.workingHoursStart,
            restaurant.workingHoursEnd
        );
        const hasStock = restaurant.listings > 0;
        return isOpen && hasStock;
    };

    const userLatitude = selectedAddress.latitude;
    const userLongitude = selectedAddress.longitude;

    useEffect(() => {
        strongHaptic();
        const loadData = async () => {
            try {
                setIsLoading(true);
                await dispatch(getRestaurantsByProximity());
            } catch (error) {
                console.error('Failed to load restaurants:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    const relocateToUserLocation = () => {
        mapRef.current?.animateToRegion({
            latitude: Number(userLatitude),
            longitude: Number(userLongitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (mapRef.current && selectedRestaurantId) {
                const restaurant = restaurants.find(r => r.id.toString() === selectedRestaurantId);
                if (restaurant) {
                    mapRef.current.animateToRegion({
                        latitude: restaurant.latitude,
                        longitude: restaurant.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 500);
                }
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [selectedRestaurantId, restaurants]);
    const handleMarkerPress = useCallback((restaurantId: string) => {
        setSelectedRestaurantId(restaurantId);
        const restaurant = restaurants.find((r) => r.id.toString() === restaurantId);
        if (!restaurant) return;
        dispatch(setSelectedRestaurant(restaurant));
        dispatch(getRestaurantThunk(restaurant.id))

        setTimeout(() => {
            bottomSheetRef.current?.snapToIndex(0);
        }, 100);
    }, [restaurants, dispatch]);

    const customMapStyle = [
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{"visibility": "off"}]
        }
    ];

    const renderMapContent = () => (
        <>
            <MapView
                style={StyleSheet.absoluteFillObject}
                ref={mapRef}
                // provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: userLatitude || 0,
                    longitude: userLongitude || 0,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation
                showsPointsOfInterest={false}
                customMapStyle={customMapStyle}
                showsCompass
                showsScale
                onMapReady={() => {
                    setIsMapReady(true);
                    setIsLoading(false);
                }}
                userInterfaceStyle="light"  // Add this line

            >
                <Marker
                    coordinate={{
                        latitude: userLatitude,
                        longitude: userLongitude,
                    }}
                    title="My Location"
                    tracksViewChanges={false}
                >
                    <Ionicons name="location-sharp" size={30} color="#B2F7A5FF"/>
                </Marker>

                {restaurants.map((restaurant) => (
                    <RestaurantMarker
                        key={restaurant.id}
                        restaurant={restaurant}
                        isSelected={selectedRestaurantId === restaurant.id.toString()}
                        onPress={() => handleMarkerPress(restaurant.id.toString())}
                    />
                ))}
            </MapView>

            <TouchableOpacity
                style={styles.relocateButton}
                onPress={relocateToUserLocation}
            >
                <Ionicons name="navigate" size={30} color="#B2F7A5FF"/>
            </TouchableOpacity>
        </>
    );

    if (!restaurants.length) {
        return (
            <View style={styles.noRestaurantsContainer}>
                <View style={StyleSheet.absoluteFillObject}>
                    {renderMapContent()}
                </View>
                <View style={styles.blurOverlay}/>
                <View style={styles.messageBox}>
                    <Text style={styles.noRestaurantsTitle}>Sorry!</Text>
                    <Text style={styles.noRestaurantsMessage}>
                        We are currently not operating in this area. Check back soon as we expand our services!
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                {renderMapContent()}
            </View>
            <BottomSheet
                style={{
                    zIndex: 5,
                }}
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                enablePanDownToClose={true}
                onChange={(index) => {
                    console.log('bottomsheet index changed:', index);
                }}>
                <BottomSheetScrollView>
                    {selectedRestaurantId && restaurants.find(r => r.id.toString() === selectedRestaurantId) && (
                        <View style={styles.restaurantInfoContainer}>
                            <View style={styles.headerContainer}>
                                {restaurants.find(r => r.id.toString() === selectedRestaurantId)?.image_url && (
                                    <Image
                                        source={{
                                            uri: restaurants.find(r => r.id.toString() === selectedRestaurantId)?.image_url || ''
                                        }}
                                        style={styles.restaurantImage}
                                    />
                                )}

                                <View style={styles.basicInfo}>
                                    <Text style={styles.restaurantName}>
                                        {restaurants.find(r => r.id.toString() === selectedRestaurantId)?.restaurantName}
                                    </Text>

                                    {/* Add availability status */}
                                    {!isRestaurantAvailable(restaurants.find(r => r.id.toString() === selectedRestaurantId)!) && (
                                        <Text style={styles.unavailableText}>
                                            {!isRestaurantOpen(
                                                restaurants.find(r => r.id.toString() === selectedRestaurantId)!.workingDays,
                                                restaurants.find(r => r.id.toString() === selectedRestaurantId)!.workingHoursStart,
                                                restaurants.find(r => r.id.toString() === selectedRestaurantId)!.workingHoursEnd
                                            )
                                                ? 'Currently Closed'
                                                : restaurants.find(r => r.id.toString() === selectedRestaurantId)!.listings <= 0
                                                    ? 'Out of Stock'
                                                    : ''
                                            }
                                        </Text>
                                    )}

                                    <View style={styles.infoRow}>
                                        <View style={styles.ratingContainer}>
                                            <Ionicons name="star" size={14} color="#FFD700"/>
                                            <Text style={styles.ratingText}>
                                                {restaurants.find(r => r.id.toString() === selectedRestaurantId)?.rating?.toFixed(1) || 'New'}
                                            </Text>
                                        </View>
                                        <Text style={styles.distanceText}>
                                            {restaurants.find(r => r.id.toString() === selectedRestaurantId)?.distance_km?.toFixed(1)} km
                                        </Text>
                                    </View>
                                </View>

                                {/* Only show menu button if restaurant is available */}
                                {isRestaurantAvailable(restaurants.find(r => r.id.toString() === selectedRestaurantId)!) && (
                                    <TouchableOpacity
                                        style={styles.menuButton}
                                        onPress={() => {
                                            dispatch(setSelectedRestaurant(restaurants.find(r => r.id.toString() === selectedRestaurantId) as Restaurant));
                                            navigation.navigate('RestaurantDetails');
                                        }}
                                    >
                                        <Text style={styles.menuButtonText}>View Menu</Text>
                                        <Ionicons name="chevron-forward" size={20} color="#333"/>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
};

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
    unavailableText: {
        color: '#FF4444',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
        fontFamily: 'Poppins-Medium',
    },

});

export default HomeMapView;