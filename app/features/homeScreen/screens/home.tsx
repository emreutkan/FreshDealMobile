import React, {useEffect, useMemo, useRef} from 'react';
import {ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {getRestaurantsByProximity, Restaurant} from '@/store/userSlice';

const AfterLoginScreen = () => {
    const dispatch = useDispatch();
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    // Select data from Redux store
    const restaurants = useSelector((state: RootState) => state.user.restaurantsProximity || []);
    const loading = useSelector((state: RootState) => state.user.loading);
    const error = useSelector((state: RootState) => state.user.error);
    const addresses = useSelector((state: RootState) => state.user.addresses);
    const selectedAddressId = useSelector((state: RootState) => state.user.selectedAddressId);

    const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

    // Fetch restaurants and update map when the selected address changes
    useEffect(() => {
        if (selectedAddress) {
            // Fetch restaurants for the selected address
            dispatch(
                getRestaurantsByProximity({
                    latitude: selectedAddress.latitude,
                    longitude: selectedAddress.longitude,
                    radius: 10, // Default radius in kilometers
                })
            );

            // Relocate the map to the selected address
            mapRef.current?.animateToRegion(
                {
                    latitude: selectedAddress.latitude,
                    longitude: selectedAddress.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                1000 // Animation duration in milliseconds
            );
        }
    }, [dispatch, selectedAddress]);

    // Fetch user's current location and relocate the map
    const relocateToUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                const region = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                mapRef.current?.animateToRegion(region, 1000);
            },
            (error) => {
                Alert.alert('Error', 'Unable to fetch your location.');
                console.error(error);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    };

    // Render the restaurant item
    const renderRestaurantItem = useMemo(
        () => ({item}: { item: Restaurant }) => (
            <View style={styles.restaurantCard}>
                <Image
                    // source={{uri: item.restaurantImageUrl || ''}}
                    style={styles.restaurantImage}
                    fadeDuration={300}
                />
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                    <View style={styles.restaurantDetails}>
                        {item.rating !== undefined && (
                            <Text style={styles.detailText}>⭐ {item.rating}</Text>
                        )}
                    </View>
                </View>
            </View>
        ),
        []
    );

    // Fallback or loading content
    const renderContent = () => {
        if (!selectedAddress) {
            return (
                <View style={styles.noRestaurantsContainer}>
                    <Text style={styles.noRestaurantsText}>
                        Please select an address to see nearby restaurants.
                    </Text>
                </View>
            );
        }

        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text>Loading restaurants...</Text>
                </View>
            );
        }

        if (!restaurants.length) {
            return (
                <View style={styles.noRestaurantsContainer}>
                    <Text style={styles.noRestaurantsText}>
                        No restaurants found in the specified proximity.
                    </Text>
                </View>
            );
        }

        return (
            <>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: selectedAddress.latitude,
                        longitude: selectedAddress.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {restaurants.map((restaurant) => (
                        <Marker
                            key={restaurant.id}
                            coordinate={{
                                latitude: restaurant.latitude,
                                longitude: restaurant.longitude,
                            }}
                            title={restaurant.restaurantName}
                            description={`Rating: ${restaurant.rating}`}
                        />
                    ))}
                </MapView>

                {/* Button to relocate to user's current location */}
                <TouchableOpacity
                    style={styles.relocateButton}
                    onPress={relocateToUserLocation}
                >
                    <Text style={styles.relocateButtonText}>📍</Text>
                </TouchableOpacity>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    handleIndicatorStyle={styles.bottomSheetHandle}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                        <Text style={styles.sectionTitle}>Restaurants in Area</Text>
                        <FlatList
                            data={restaurants}
                            renderItem={renderRestaurantItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    </BottomSheetScrollView>
                </BottomSheet>
            </>
        );
    };

    return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
    },
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    restaurantInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    restaurantDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#666',
    },
    listContainer: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRestaurantsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRestaurantsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    relocateButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    relocateButtonText: {
        fontSize: 24,
    },
});

export default AfterLoginScreen;
