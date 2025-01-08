import React, {useRef, useState} from 'react';
import {Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {Address} from '@/store/slices/addressSlice';
import {Restaurant} from '@/store/slices/restaurantSlice';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import {scaleFont} from '@/src/utils/ResponsiveFont';

interface MapProps {
    restaurantId: string;
}

const LocateToRestaurant = ({restaurantId}: MapProps) => {
    const mapRef = useRef<MapView>(null);
    const [travelMode, setTravelMode] = useState<'WALKING' | 'DRIVING'>('WALKING');
    const [selected, setSelected] = useState<boolean>(false);

    // Grab user’s current address from Redux
    const addressState = useSelector((state: RootState) => state.address);
    const selectedAddress = addressState.addresses.find(
        (address) => address.id === addressState.selectedAddressId
    ) as Address;

    const latitude = selectedAddress?.latitude;
    const longitude = selectedAddress?.longitude;

    // Grab the restaurant info from Redux
    const restaurants = useSelector(
        (state: RootState) => state.restaurant.restaurantsProximity
    );
    const restaurant = restaurants.find(
        (rest: Restaurant) => rest.id === restaurantId
    );

    // If data is missing, return null
    if (!restaurant || latitude == null || longitude == null) {
        return null;
    }

    const userLocation = {
        latitude: Number(latitude),
        longitude: Number(longitude),
    };

    const restaurantLocation = {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
    };

    const openNavigation = () => {
        const {latitude, longitude} = restaurantLocation;
        const travelModeParam = travelMode === 'WALKING' ? 'walking' : 'driving';

        if (Platform.OS === 'ios') {
            const googleMapsUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=${travelModeParam}`;
            const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${travelModeParam}`;

            Linking.canOpenURL('comgooglemaps://')
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(googleMapsUrl);
                    } else {
                        Linking.openURL(fallbackUrl);
                    }
                })
                .catch((err) => console.error('Error opening map:', err));
        } else {
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${travelModeParam}`;
            Linking.openURL(googleMapsUrl).catch((err) =>
                console.error('Error opening map:', err)
            );
        }
    };

    const handleMarkerPress = () => {
        // Simply toggle `selected`, no scaling
        setSelected((prev) => !prev);
    };

    return (
        <>
            <MapView
                style={StyleSheet.absoluteFillObject}
                ref={mapRef}
                initialRegion={{
                    ...userLocation,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {/* Marker: User's Location */}
                <Marker
                    coordinate={userLocation}
                    title="Your Location"
                    pinColor="blue"
                />

                {/* Interactive Marker: Restaurant */}
                <Marker
                    key={restaurant.id}
                    coordinate={restaurantLocation}
                    onPress={handleMarkerPress}
                >
                    {/* We wrap the image (or Ionicon) in a parent View that handles the green border */}
                    <View
                        style={[
                            styles.markerContainer,
                            selected && styles.markerSelected, // Apply green ring if selected
                        ]}
                    >
                        {restaurant.image_url ? (


                            <Image
                                source={{uri: restaurant.image_url}}
                                style={styles.markerImage}
                                resizeMode="cover"
                            />

                        ) : (
                            <Ionicons
                                name="location-sharp"
                                size={40}
                                color="red"
                            />
                        )}
                    </View>
                </Marker>

                {/* Draw the route if the API key exists */}
                {Constants.expoConfig?.extra?.googleMapsApiKey && (
                    <MapViewDirections
                        origin={userLocation}
                        destination={restaurantLocation}
                        apikey={Constants.expoConfig.extra.googleMapsApiKey}
                        strokeWidth={4}
                        strokeColor="hotpink"
                        mode={travelMode}
                        onReady={(result) => {
                            mapRef.current?.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    top: 100,
                                    right: 100,
                                    bottom: 100,
                                    left: 100,
                                },
                                animated: true,
                            });
                        }}
                    />
                )}
            </MapView>

            {/* Navigation Button displayed when marker is selected */}
            {selected && (
                <View style={styles.navigationButtonContainer}>
                    <TouchableOpacity
                        style={styles.navigateButton}
                        onPress={openNavigation}
                    >
                        <Ionicons name="navigate" size={24} color="white"/>
                        <Text style={styles.navigateButtonText}>Start Navigation</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Buttons for toggling travel mode */}
            <View style={styles.buttonContainer}>
                <View style={styles.travelModeContainer}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setTravelMode('WALKING')}
                    >
                        <Ionicons
                            name="walk"
                            size={24}
                            color={travelMode === 'WALKING' ? 'blue' : 'black'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setTravelMode('DRIVING')}
                    >
                        <Ionicons
                            name="car"
                            size={24}
                            color={travelMode === 'DRIVING' ? 'blue' : 'black'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    // The outer container for the marker that provides the ring
    markerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 46,
        height: 46,
        borderRadius: 23,
        borderWidth: 2,
        borderColor: 'transparent', // Default is transparent
        // backgroundColor: 'white',    // Optional - helps define the ring visually
    },
    markerSelected: {
        borderColor: '#b2f7a5', // Highlight border
        borderWidth: 20,
    },
    // If using an actual image, you can adapt:
    markerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    iconPlaceholder: {
        // This is just to show a placeholder Ionicon in place of the image
        textAlign: 'center',
    },
    // Default pin, if no image_url
    defaultMarker: {
        width: 40,
        height: 40,
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        right: 20,
        top: '10%', // Adjust as needed
        flexDirection: 'column',
        alignItems: 'center',
    },
    travelModeContainer: {
        marginBottom: 20,
    },
    iconButton: {
        top: scaleFont(70),
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 15,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    navigationButtonContainer: {
        position: 'absolute',
        bottom: 30, // Adjust as needed
        left: '50%',
        transform: [{translateX: -scaleFont(80)}], // Half of button width to center
    },
    navigateButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        alignItems: 'center',
    },
    navigateButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
});

export default LocateToRestaurant;
