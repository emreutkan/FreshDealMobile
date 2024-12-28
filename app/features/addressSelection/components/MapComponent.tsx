// components/MapComponent.tsx
import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import {MaterialIcons} from '@expo/vector-icons';
import debounce from 'lodash.debounce';
import {scaleFont} from "@/app/utils/ResponsiveFont";

interface MapComponentProps {
    region: Region;
    setRegion: (region: Region) => void;
    onMapInteraction: () => void;
    onAddressUpdate: (latitude: number, longitude: number) => void;
    isReverseGeocoding: boolean;
    fetchLocation: () => void;
    locationLoading: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
                                                       region,
                                                       setRegion,
                                                       onMapInteraction,
                                                       onAddressUpdate,
                                                       isReverseGeocoding,
                                                       fetchLocation,
                                                       locationLoading,
                                                   }) => {
    const mapRef = useRef<MapView>(null);

    const debouncedHandleAddressUpdate = debounce((lat: number, lng: number) => {
        onAddressUpdate(lat, lng);
    }, 0);

    const handleRegionChangeComplete = (newRegion: Region) => {
        setRegion(newRegion);
        debouncedHandleAddressUpdate(newRegion.latitude, newRegion.longitude);
    };

    useEffect(() => {
        return () => {
            debouncedHandleAddressUpdate.cancel();
        };
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(region); // 1 second animation
            console.log('Animating to region:', region);
            debouncedHandleAddressUpdate(region.latitude, region.longitude); // set the data as users address at launch

        }
    }, [region]);


    return (
        <Animated.View style={styles.mapContainer}>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                onTouchStart={onMapInteraction}
                mapType="terrain"
                showsUserLocation
                followsUserLocation={false}
            />

            <MaterialIcons name="place" size={48} color="#FF0000" style={styles.centerMarker}/>
            <TouchableOpacity
                style={styles.myLocationButton}
                onPress={fetchLocation}
                accessibilityLabel="Use My Location"
                accessibilityHint="Centers the map on your current location and fills in your address"
                disabled={locationLoading}
            >
                {locationLoading ? (
                    <ActivityIndicator size="small" color="#0000ff"/>
                ) : (
                    <MaterialIcons name="my-location" size={24} color="#fff"/>
                )}
            </TouchableOpacity>
            {isReverseGeocoding && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#0000ff"/>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: scaleFont(-23.5),
        marginTop: scaleFont(-13),
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        padding: 12,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Added background color
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapComponent;
