import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";
import {getRestaurantsByProximity} from "@/src/redux/thunks/restaurantThunks";
import {strongHaptic} from "@/src/utils/Haptics";
import MapView, {Marker} from "react-native-maps";
import {Address} from "@/src/types/api/address/model";
import {Ionicons} from "@expo/vector-icons";

const HomeMapView: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity);
    const addressState = useSelector((state: RootState) => state.address);
    const selectedAddress = addressState.addresses.find(
        (address) => address.id === addressState.selectedAddressId
    ) as Address;

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

    const handleMarkerPress = (restaurantId: string) => {
        setSelectedRestaurantId(restaurantId);
    };

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
                    latitude: userLatitude,
                    longitude: userLongitude,
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
                    <Marker
                        key={restaurant.id}
                        coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude,
                        }}
                        onPress={() => handleMarkerPress(restaurant.id.toString())}
                        tracksViewChanges={false}
                    >
                        <View
                            style={[
                                styles.markerContainer,
                                selectedRestaurantId === restaurant.id.toString() && styles.selectedMarker,
                            ]}
                        >
                            {restaurant.image_url ? (
                                <Image
                                    source={{
                                        uri: restaurant.image_url.replace('127.0.0.1', '192.168.1.3'),
                                    }}
                                    style={styles.markerImage}
                                    resizeMode="cover"
                                    onError={() => console.log(`Failed to load image for restaurant ${restaurant.id}`)}
                                />
                            ) : (
                                <View style={styles.defaultMarkerContainer}>
                                    <Ionicons name="restaurant-outline" size={30} color="#333"/>
                                </View>
                            )}
                        </View>
                    </Marker>
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
    relocateButton: {
        position: 'absolute',
        bottom: 100,
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
});

export default HomeMapView;