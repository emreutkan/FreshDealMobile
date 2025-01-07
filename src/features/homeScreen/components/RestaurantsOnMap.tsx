// create a mapview component

import React, {useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity,} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {RootState} from '@/store/store';
import {Address} from "@/store/slices/addressSlice";
import {Restaurant} from "@/store/slices/restaurantSlice";
import {useSelector} from "react-redux";

interface MapProps {
    restaurants: Restaurant[];
    setLatitudeDelta: number;
    setLongitudeDelta: number;
    coverEntireScreen: boolean;

}

const RestaurantsOnMap = ({
                              restaurants,
                              setLatitudeDelta,
                              setLongitudeDelta,
                              coverEntireScreen
                          }: MapProps) => {

    const mapRef = useRef<MapView>(null);
    const addressState = useSelector((state: RootState) => state.address);
    const selectedAddress = addressState.addresses.find((address) => address.id === addressState.selectedAddressId) as Address;
    const latitude = selectedAddress.latitude;
    const longitude = selectedAddress.longitude;
    const relocateToUserLocation = () => {
        const region = {
            latitude: Number(selectedAddress.latitude),
            longitude: Number(selectedAddress.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        mapRef.current?.animateToRegion(region, 500);
    };


    return (

        <>
            <MapView
                style={[
                    coverEntireScreen ? StyleSheet.absoluteFillObject : styles.map,

                ]}
                // style={{...styles.map, ...styles.map}}
                ref={mapRef}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: setLatitudeDelta,
                    longitudeDelta: setLongitudeDelta,
                }}>
                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude,
                        }}
                        title={restaurant.restaurantName}
                        description={restaurant.restaurantDescription}
                    />
                ))}
            </MapView>
            <TouchableOpacity
                style={styles.relocateButton}
                onPress={relocateToUserLocation}
            >
                <Text style={styles.relocateButtonText}>📍</Text>
            </TouchableOpacity>
        </>
    );
};

export default RestaurantsOnMap;

const styles = {
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    relocateButton: {
        position: 'absolute' as 'absolute', // Corrected type
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center" as "center", // Corrected type
        alignItems: "center" as "center",
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    relocateButtonText: {
        fontSize: 24,
    },
};