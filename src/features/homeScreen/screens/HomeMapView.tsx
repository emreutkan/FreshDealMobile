import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";
import {getRestaurantsByProximity, getRestaurantThunk} from "@/src/redux/thunks/restaurantThunks";
import {strongHaptic} from "@/src/utils/Haptics";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {Address} from "@/src/types/api/address/model";
import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {setSelectedRestaurant} from "@/src/redux/slices/restaurantSlice";
import {RestaurantMarker} from "@/src/features/RestaurantScreen/components/RestaurantMarker";
import {RootStackParamList} from "@/src/utils/navigation";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {LinearGradient} from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const {width, height} = Dimensions.get('window');

const HomeMapView: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const pulseAnim = useRef(new Animated.Value(0)).current;

    const [mapReady, setMapReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

    const navigation = useNavigation<NavigationProp>();
    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity);
    const addressState = useSelector((state: RootState) => state.address);
    const selectedAddress = addressState.addresses.find(
        (address) => address.id === addressState.selectedAddressId
    ) as Address;

    const snapPoints = useMemo(() => ['25%'], []);

    const userLatitude = selectedAddress?.latitude || 0;
    const userLongitude = selectedAddress?.longitude || 0;

    const initialRegion = useMemo(() => ({
        latitude: userLatitude,
        longitude: userLongitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    }), [userLatitude, userLongitude]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    }, [pulseAnim]);

    const isRestaurantOpen = useCallback((
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
    }, []);

    const isRestaurantAvailable = useCallback((restaurant: Restaurant): boolean => {
        const isOpen = isRestaurantOpen(
            restaurant.workingDays,
            restaurant.workingHoursStart,
            restaurant.workingHoursEnd
        );
        const hasStock = restaurant.listings > 0;
        return isOpen && hasStock;
    }, [isRestaurantOpen]);

    useEffect(() => {
        strongHaptic();
        setLoading(true);
        dispatch(getRestaurantsByProximity())
            .catch(error => console.error('Failed to load restaurants:', error))
            .finally(() => setLoading(false));
    }, [dispatch]);

    const relocateToUserLocation = useCallback(() => {
        if (!mapRef.current) return;

        mapRef.current.animateToRegion({
            latitude: Number(userLatitude),
            longitude: Number(userLongitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);
    }, [userLatitude, userLongitude]);

    useEffect(() => {
        if (!mapReady || !selectedRestaurantId || !mapRef.current) return;

        const restaurant = restaurants.find(r => r.id.toString() === selectedRestaurantId);
        if (!restaurant) return;

        mapRef.current.animateToRegion({
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);
    }, [selectedRestaurantId, restaurants, mapReady]);

    const handleMarkerPress = useCallback((restaurantId: string) => {
        setSelectedRestaurantId(restaurantId);
        const restaurant = restaurants.find((r) => r.id.toString() === restaurantId);
        if (!restaurant) return;

        dispatch(setSelectedRestaurant(restaurant));
        dispatch(getRestaurantThunk(restaurant.id));
        bottomSheetRef.current?.snapToIndex(0);

        // Trigger haptic feedback
        strongHaptic();
    }, [restaurants, dispatch]);

    const selectedRestaurant = useMemo(() =>
            restaurants.find(r => r.id.toString() === selectedRestaurantId),
        [restaurants, selectedRestaurantId]);

    // Modern, cleaner map style
    const customMapStyle = [
        {
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#616161"}]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#f5f5f5"}]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#bdbdbd"}]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"color": "#eeeeee"}]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#757575"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#e5e5e5"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9e9e9e"}]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"color": "#ffffff"}]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#757575"}]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{"color": "#dadada"}]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#616161"}]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9e9e9e"}]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{"color": "#e5e5e5"}]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{"color": "#eeeeee"}]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#c9c9c9"}]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9e9e9e"}]
        }
    ];

    const renderMapContent = () => (
        <>
            <MapView
                style={StyleSheet.absoluteFillObject}
                ref={mapRef}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton={false}
                showsPointsOfInterest={false}
                showsCompass={false}
                showsScale={false}
                showsBuildings={false}
                showsTraffic={false}
                showsIndoors={false}
                customMapStyle={customMapStyle}
                onMapReady={() => setMapReady(true)}
                userInterfaceStyle="light"
            >
                <Marker
                    coordinate={{
                        latitude: userLatitude,
                        longitude: userLongitude,
                    }}
                    title="My Location"
                    tracksViewChanges={false}
                >
                    <View style={styles.userMarkerContainer}>
                        <Animated.View style={[
                            styles.userMarkerPulse,
                            {
                                transform: [
                                    {
                                        scale: pulseAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 1.3]
                                        })
                                    }
                                ],
                                opacity: pulseAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.7, 0]
                                })
                            }
                        ]}/>
                        <View style={styles.userMarkerInner}/>
                    </View>
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

            <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'transparent']}
                style={styles.topGradient}
            />

            <View style={styles.mapControls}>
                <TouchableOpacity
                    style={styles.relocateButton}
                    onPress={relocateToUserLocation}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#B2F7A5', '#7DE667']}
                        style={styles.relocateButtonGradient}
                    >
                        <Ionicons name="navigate" size={24} color="#003320"/>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#B2F7A5"/>
                <Text style={styles.loadingText}>Finding nearby restaurants...</Text>
            </View>
        );
    }

    if (!restaurants.length) {
        return (
            <View style={styles.noRestaurantsContainer}>
                <View style={StyleSheet.absoluteFillObject}>
                    {renderMapContent()}
                </View>
                <View style={styles.blurOverlay}/>
                <LinearGradient
                    colors={['#FFFFFF', '#F5F5F5']}
                    style={styles.messageBox}
                >
                    <Ionicons name="restaurant-outline" size={60} color="#FF5A5F" style={styles.noRestaurantsIcon}/>
                    <Text style={styles.noRestaurantsTitle}>Sorry!</Text>
                    <Text style={styles.noRestaurantsMessage}>
                        We are currently not operating in this area. Check back soon as we expand our services!
                    </Text>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                {renderMapContent()}
            </View>

            <BottomSheet
                style={styles.bottomSheet}
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                enablePanDownToClose={true}
                handleIndicatorStyle={styles.bottomSheetIndicator}
                handleStyle={styles.bottomSheetHandle}
                backgroundStyle={styles.bottomSheetBackground}
            >
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContentContainer}>
                    {selectedRestaurant && (
                        <View style={styles.restaurantInfoContainer}>
                            <View style={styles.headerContainer}>
                                {selectedRestaurant.image_url && (
                                    <Image
                                        source={{uri: selectedRestaurant.image_url}}
                                        style={styles.restaurantImage}
                                        resizeMode="cover"
                                    />
                                )}

                                <View style={styles.basicInfo}>
                                    <Text style={styles.restaurantName}>
                                        {selectedRestaurant.restaurantName}
                                    </Text>

                                    {!isRestaurantAvailable(selectedRestaurant) && (
                                        <View style={styles.statusContainer}>
                                            <View style={styles.statusIndicator}/>
                                            <Text style={styles.unavailableText}>
                                                {!isRestaurantOpen(
                                                    selectedRestaurant.workingDays,
                                                    selectedRestaurant.workingHoursStart,
                                                    selectedRestaurant.workingHoursEnd
                                                )
                                                    ? 'Currently Closed'
                                                    : selectedRestaurant.listings <= 0
                                                        ? 'Out of Stock'
                                                        : ''
                                                }
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.infoRow}>
                                        <View style={styles.ratingContainer}>
                                            <Ionicons name="star" size={14} color="#FFD700"/>
                                            <Text style={styles.ratingText}>
                                                {selectedRestaurant.rating?.toFixed(1) || 'New'}
                                            </Text>
                                        </View>
                                        <View style={styles.distanceContainer}>
                                            <Ionicons name="location-outline" size={14} color="#666"/>
                                            <Text style={styles.distanceText}>
                                                {selectedRestaurant.distance_km?.toFixed(1)} km
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {isRestaurantAvailable(selectedRestaurant) && (
                                    <TouchableOpacity
                                        style={styles.menuButton}
                                        onPress={() => {
                                            dispatch(setSelectedRestaurant(selectedRestaurant));
                                            navigation.navigate('RestaurantDetails');
                                        }}
                                        activeOpacity={0.9}
                                    >
                                        <LinearGradient
                                            colors={['#B2F7A5', '#7DE667']}
                                            style={styles.menuButtonGradient}
                                        >
                                            <Text style={styles.menuButtonText}>View Menu</Text>
                                            <Ionicons name="chevron-forward" size={16} color="#003320"/>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.divider}/>
                            <Text style={styles.restaurantDescription}>
                                {selectedRestaurant.restaurantDescription}
                            </Text>
                            <View style={styles.deliveryInfoContainer}>
                                {selectedRestaurant.delivery && (
                                    <View style={styles.deliveryInfo}>
                                        <Ionicons name="bicycle-outline" size={14} color="#666"/>
                                        <Text style={styles.deliveryText}>
                                            Delivery ${selectedRestaurant.deliveryFee?.toFixed(2)}
                                        </Text>
                                    </View>
                                )}
                                {selectedRestaurant.pickup && (
                                    <View style={styles.deliveryInfo}>
                                        <Ionicons name="walk-outline" size={14} color="#666"/>
                                        <Text style={styles.deliveryText}>Pickup available</Text>
                                    </View>
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
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    mapControls: {
        position: 'absolute',
        bottom: 150,
        right: 20,
        alignItems: 'center',
    },
    relocateButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 1,
    },
    relocateButtonGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userMarkerContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userMarkerPulse: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#B2F7A5',
    },
    userMarkerInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#006400',
        borderWidth: 2,
        borderColor: 'white',
    },
    bottomSheet: {
        zIndex: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    bottomSheetHandle: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 24,
    },
    bottomSheetIndicator: {
        backgroundColor: '#D1D1D6',
        width: 40,
        marginTop: 8,
    },
    bottomSheetBackground: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetContentContainer: {
        paddingBottom: 30,
    },
    restaurantInfoContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    basicInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        fontFamily: 'Poppins-Bold',
        color: '#1E1E1E',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4444',
        marginRight: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E0',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    distanceText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
    },
    menuButton: {
        marginLeft: 'auto',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    menuButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 20,
    },
    menuButtonText: {
        color: '#003320',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    divider: {
        height: 1,
        backgroundColor: '#E1E1E8',
        marginVertical: 12,
    },
    restaurantDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
    },
    deliveryInfoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    deliveryText: {
        marginLeft: 6,
        fontSize: 12,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    unavailableText: {
        color: '#FF4444',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
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
    noRestaurantsIcon: {
        marginBottom: 12,
    },
    messageBox: {
        width: '85%',
        borderRadius: 24,
        padding: 28,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
        alignItems: 'center',
    },
    noRestaurantsTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FF5A5F',
        marginBottom: 12,
        fontFamily: 'Poppins-Bold',
    },
    noRestaurantsMessage: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#484848',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default HomeMapView;