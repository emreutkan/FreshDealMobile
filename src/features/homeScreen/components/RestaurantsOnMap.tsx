// components/RestaurantsOnMap.tsx
import React, {useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import {RootState} from '@/src/redux/store';
import {useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import {Restaurant} from "@/src/types/api/restaurant/model";
import {Address} from "@/src/types/api/address/model";

interface MapProps {
    restaurants: Restaurant[];
    setLatitudeDelta: number;
    setLongitudeDelta: number;
    coverEntireScreen: boolean;
}

const RestaurantsOnMap: React.FC<MapProps> = ({
                                                  restaurants,
                                                  setLatitudeDelta,
                                                  setLongitudeDelta,
                                                  coverEntireScreen,
                                              }) => {
    const mapRef = useRef<MapView>(null);

    // Get user selected address
    const addressState = useSelector((state: RootState) => state.address);
    const selectedAddress = addressState.addresses.find(
        (address) => address.id === addressState.selectedAddressId
    ) as Address;

    const userLatitude = selectedAddress.latitude;
    const userLongitude = selectedAddress.longitude;

    // Local state for tracking selected restaurant marker
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

    const relocateToUserLocation = () => {
        const region = {
            latitude: Number(userLatitude),
            longitude: Number(userLongitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(region, 500);
    };

    const handleMarkerPress = (restaurantId: string) => {
        setSelectedRestaurantId(restaurantId);
    };


// Add map style customization
    const customMapStyle = [
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ];

    return (
        <>
            <MapView
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                ]}

                ref={mapRef}
                initialRegion={{
                    latitude: userLatitude,
                    longitude: userLongitude,
                    latitudeDelta: setLatitudeDelta,
                    longitudeDelta: setLongitudeDelta,
                }}
                showsUserLocation={true}
                showsPointsOfInterest={false} // Hides unnecessary POIs
                customMapStyle={customMapStyle}
                // onMapReady={mapReadyAnimation}
                showsCompass={true}
                showsScale={true}
            >
                {/** Render user location marker */}
                <Marker
                    coordinate={{
                        latitude: userLatitude,
                        longitude: userLongitude,
                    }}
                    title="My Location"
                    tracksViewChanges={false}  // try adding this prop

                >
                    <Ionicons name="location-sharp" size={30} color="#B2F7A5FF"/>
                </Marker>

                {/** Render restaurant markers */}
                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude,
                        }}
                        onPress={() => handleMarkerPress(restaurant.id.toString())}
                    >
                        {/** Custom marker view: if image exists, show image; otherwise, show default icon */}
                        {restaurant.image_url ? (
                            <View
                                style={[
                                    styles.markerContainer,
                                    selectedRestaurantId === restaurant.id.toString() && styles.selectedMarker,
                                ]}
                            >
                                <Image
                                    source={{
                                        uri: restaurant.image_url.replace('127.0.0.1', '192.168.1.3'),
                                    }}
                                    style={styles.markerImage}
                                />
                            </View>
                        ) : (
                            <View
                                style={[
                                    styles.defaultMarkerContainer,
                                    selectedRestaurantId === restaurant.id.toString() && styles.selectedMarker,
                                ]}
                            >
                                <Ionicons name="restaurant-outline" size={30} color="#333"/>
                            </View>
                        )}

                        {/** Show callout with restaurant name when selected */}
                        {selectedRestaurantId === restaurant.id && (
                            <Callout tooltip>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{restaurant.restaurantName}</Text>
                                </View>
                            </Callout>
                        )}
                    </Marker>
                ))}
            </MapView>

            {/** Relocate button */}
            <TouchableOpacity
                style={[styles.relocateButton, {zIndex: 2}]}
                onPress={relocateToUserLocation}
            >
                <Ionicons name="navigate" size={scaleFont(30)} color="#B2F7A5FF"/>
            </TouchableOpacity>
        </>
    );
};

export default RestaurantsOnMap;

const styles = StyleSheet.create({
    relocateButton: {
        position: 'absolute',
        top: 600,
        right: 20,
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
        zIndex: 1,
    },
    markerContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
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
    selectedMarker: {
        borderColor: '#B2F7A5FF', // Use the same color as navigation arrow
        borderWidth: 4, // Thicker ring for selected marker
    },
    markerImage: {
        width: '100%',
        height: '100%',
    },
    calloutContainer: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderColor: '#B2F7A5FF',
        borderWidth: 1,
    },
    calloutText: {
        fontSize: 14,
        color: '#B2F7A5FF',
        fontWeight: 'bold',
    },
});
