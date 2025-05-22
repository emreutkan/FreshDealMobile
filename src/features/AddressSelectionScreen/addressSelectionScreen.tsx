import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Keyboard,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import MapView, {MapStyleElement, Region} from 'react-native-maps';
import * as Location from 'expo-location';
import {FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons,} from '@expo/vector-icons';
import debounce from 'lodash.debounce';
import {BlurView} from 'expo-blur';
import {addAddressAsync, updateAddress} from '@/src/redux/thunks/addressThunks';
import {AppDispatch} from '@/src/redux/store';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {THEME} from '@/src/styles/Theme';
import {CustomButton} from '@/src/features/LoginRegister/components/CustomButton';
import BaseInput from '@/src/features/LoginRegister/components/BaseInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Address} from '@/src/types/api/address/model';

// ------------------------------------------------------------------------
// Detailed map style configuration
const customMapStyle: MapStyleElement[] = [
    {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#7f8c8d'}]},
    {featureType: 'road', elementType: 'geometry', stylers: [{color: '#ffffff'}]},
    {featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#2c3e50'}]},
    {featureType: 'poi', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'geometry.fill', stylers: [{color: '#ecf0f1'}]},
    {featureType: 'water', elementType: 'geometry.fill', stylers: [{color: '#3498db'}]},
    {featureType: 'transit', stylers: [{visibility: 'off'}]},
];

// ------------------------------------------------------------------------
// Local temporary address class for new address creation/updating.
class TempAddress implements Address {
    id: string = '';
    title: string = '';
    latitude: number = 0;
    longitude: number = 0;
    street: string = '';
    neighborhood: string = '';
    district: string = '';
    province: string = '';
    country: string = '';
    postalCode: string = '';
    apartmentNo: string = '';
    doorNo: string = '';
    is_primary: boolean = true;
}

type RouteParams = {
    AddressScreen: {
        addressToEdit?: Address; // optional address for editing
    };
};

const AddressScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RouteParams, 'AddressScreen'>>();
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);
    const insets = useSafeAreaInsets();
    const {height} = Dimensions.get('window');

    // Check if we are editing or adding a new address.
    const isEditing = Boolean(route.params?.addressToEdit);

    // Animation states – We overlay the form over a full-screen map rather than animating the map container.
    const [contentOpacity] = useState(new Animated.Value(isEditing ? 1 : 0));
    const [mapAnimation] = useState(new Animated.Value(0));

    // UI States
    const [activateAddressDetails, setActivateAddressDetails] = useState<boolean>(isEditing);

    // Loading states
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);

    // Data States
    const [selectedAddress, setSelectedAddress] = useState<TempAddress>(() => {
        // If editing, initialize with the address we receive via route params.
        if (isEditing && route.params?.addressToEdit) {
            console.log('Editing address:', route.params.addressToEdit);
            return {...new TempAddress(), ...route.params.addressToEdit};
        }
        console.log('Creating new address');
        return new TempAddress();
    });
    const [region, setRegion] = useState<Region>(() => {
        // Default to Turkey’s center
        return {
            latitude: isEditing && route.params?.addressToEdit ? route.params.addressToEdit.latitude : 38.454985,
            longitude: isEditing && route.params?.addressToEdit ? route.params.addressToEdit.longitude : 27.100052,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    });
    const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);

    // Form Errors
    const [errors, setErrors] = useState({
        title: '',
        apartmentNo: '',
        doorNo: '',
    });

    // ------------------------------------------------------------------------
    // Animation for overlaying the form.
    const animateForm = (show: boolean) => {
        Animated.parallel([
            Animated.timing(contentOpacity, {
                toValue: show ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(mapAnimation, {
                toValue: show ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        // If editing, form should be visible on mount.
        animateForm(activateAddressDetails);
    }, [activateAddressDetails]);

    useEffect(() => {
        return () => {
            debouncedHandleAddressUpdate.cancel();
            debouncedValidateField.cancel();
        };
    }, []);

    // ------------------------------------------------------------------------
    // Location permission and initial location fetch.
    const fetchLocation = async () => {
        try {
            const {status: existingStatus} = await Location.getForegroundPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Location.requestForegroundPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Location Permission Required',
                    'Please enable location services to use the address selection feature.',
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {
                            text: 'Open Settings',
                            onPress: async () => {
                                await Linking.openSettings();
                            },
                        },
                    ]
                );
                setInitialLoading(false);
                setLocationLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 5000,
            });

            const {latitude, longitude} = location.coords;
            const newRegion: Region = {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 1000);
            await handleAddressUpdate(latitude, longitude);
        } catch (error) {
            console.error('Location fetch error:', error);
            Alert.alert(
                'Location Error',
                'Unable to fetch your location. Please try again or select manually.'
            );
        } finally {
            setInitialLoading(false);
            setLocationLoading(false);
        }
    };

    // Handler to get user's current location.
    const getUserLocation = async () => {
        if (locationLoading) return;
        setLocationLoading(true);
        await fetchLocation();
    };

    useEffect(() => {
        if (!isEditing) {
            (async () => {
                await fetchLocation();
            })();
        } else {
            // For editing, we assume the region is already set from the address passed in.
            setInitialLoading(false);
        }
    }, [isEditing]);

    // ------------------------------------------------------------------------
    // Reverse Geocode to update selectedAddress based on latitude/longitude.
    const handleAddressUpdate = async (latitude: number, longitude: number) => {
        try {
            setIsReverseGeocoding(true);
            console.log('Fetching address for:', latitude, longitude);

            const [addressData] = await Location.reverseGeocodeAsync({latitude, longitude});
            console.log('Received address data:', addressData);

            if (!addressData) {
                Alert.alert(
                    'Address Lookup Failed',
                    'No address data found. Please try again or enter manually.'
                );
                return;
            }

            // To avoid duplicate street info, we choose one based on preference:
            const streetName = addressData.street || addressData.name || '';

            const formattedAddress = {
                ...selectedAddress,
                street: streetName,
                neighborhood: addressData.subregion || '',
                district: addressData.city || addressData.district || '',
                province: addressData.region || '',
                country: addressData.country || '',
                postalCode: addressData.postalCode || '',
                latitude: Number(latitude.toFixed(6)),
                longitude: Number(longitude.toFixed(6)),
            };

            setSelectedAddress(formattedAddress);
        } catch (error) {
            console.error('Geocoding error:', error);
            Alert.alert(
                'Address Lookup Failed',
                'Unable to get address details. Please try again or enter manually.'
            );
        } finally {
            setIsReverseGeocoding(false);
        }
    };

    // ------------------------------------------------------------------------
    // Debounced address update when the map is moved
    const debouncedHandleAddressUpdate = useRef(
        debounce(async (latitude: number, longitude: number) => {
            await handleAddressUpdate(latitude, longitude);
        }, 800)
    ).current;

    // ------------------------------------------------------------------------
    // VALIDATIONS
    // We separate data update from validations.
    const handleInputChange = (field: keyof TempAddress, value: string) => {
        setSelectedAddress((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear the error immediately for better UX
        setErrors((prev) => ({...prev, [field]: ''}));
        // Use debounced validation to avoid blocking fast typing
        debouncedValidateField(field, value);
    };

    const debouncedValidateField = useRef(
        debounce((field: keyof TempAddress, value: string) => {
            const validationRules: Record<string, any> = {
                title: {
                    required: true,
                    minLength: 3,
                    maxLength: 50,
                    pattern: /^[a-zA-Z0-9\s-]+$/,
                    message:
                        'Title must be 3-50 characters long and contain only letters, numbers, spaces, and hyphens',
                },
                apartmentNo: {
                    pattern: /^\d{1,4}$/,
                    message: 'Apartment number must be 1-4 digits',
                },
                doorNo: {
                    pattern: /^[a-zA-Z0-9-]{1,10}$/,
                    message: 'Door number must be 1-10 characters (letters, numbers, or hyphens)',
                },
            };

            const rule = validationRules[field];
            if (rule) {
                // If required and empty, set error.
                if (rule.required && !value.trim()) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]:
                            field.charAt(0).toUpperCase() + field.slice(1) + ' is required',
                    }));
                    return;
                }
                // Pattern check
                if (rule.pattern && !rule.pattern.test(value)) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: rule.message,
                    }));
                    return;
                }
                // Check minLength
                if (rule.minLength && value.length < rule.minLength) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: `Minimum length is ${rule.minLength} characters`,
                    }));
                    return;
                }
                // Check maxLength
                if (rule.maxLength && value.length > rule.maxLength) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: `Maximum length is ${rule.maxLength} characters`,
                    }));
                    return;
                }
            }
        }, 500)
    ).current;

    // ------------------------------------------------------------------------
    // Confirm handler – dispatches the correct thunk
    const handleAddressConfirm = async () => {
        // Check required fields
        const requiredFields = {
            title: selectedAddress.title,
            street: selectedAddress.street,
            district: selectedAddress.district,
            province: selectedAddress.province,
            country: selectedAddress.country,
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value || value.trim() === '')
            .map(([key]) => key);

        if (missingFields.length > 0) {
            Alert.alert(
                'Missing Information',
                `Please fill in the following fields:\n${missingFields
                    .map((field) => `• ${field.charAt(0).toUpperCase() + field.slice(1)}`)
                    .join('\n')}`
            );
            return;
        }

        // Validate coordinates
        if (!selectedAddress.latitude || !selectedAddress.longitude) {
            Alert.alert('Invalid Location', 'Please select a valid location on the map.');
            return;
        }

        try {
            if (isEditing && route.params?.addressToEdit) {
                // If editing, send only the updates.
                const updates = {
                    ...selectedAddress,
                    apartmentNo: selectedAddress.apartmentNo.toString(),
                    latitude: Number(selectedAddress.latitude),
                    longitude: Number(selectedAddress.longitude),
                    is_primary: true,
                };
                // Dispatch updateAddress with the existing address id.
                await dispatch(
                    updateAddress({id: route.params.addressToEdit.id, updates})
                ).unwrap();
            } else {
                // Otherwise, dispatch addAddressAsync to create a new address.
                const addressPayload = {
                    ...selectedAddress,
                    apartmentNo: selectedAddress.apartmentNo.toString(),
                    latitude: Number(selectedAddress.latitude),
                    longitude: Number(selectedAddress.longitude),
                    is_primary: true,
                };

                await dispatch(addAddressAsync(addressPayload)).unwrap();
            }
            navigation.goBack();
        } catch (error: any) {
            Alert.alert(
                'Error',
                error?.message || 'Failed to save address. Please try again.'
            );
        }
    };

    // ------------------------------------------------------------------------
    // Render loading screen if initial location is still loading.
    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={THEME.colors.primary}/>
                <Text style={styles.loadingText}>Initializing map...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                region={region}
                customMapStyle={customMapStyle}
                onRegionChangeComplete={async (newRegion: Region) => {
                    // Only update if the form is not active.
                    if (!activateAddressDetails && isMapInteracted) {
                        setRegion(newRegion);
                        await debouncedHandleAddressUpdate(newRegion.latitude, newRegion.longitude);
                    }
                }}
                onTouchStart={() => {
                    setIsMapInteracted(true);
                    if (activateAddressDetails) {
                        setActivateAddressDetails(false);
                        animateForm(false);
                    }
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={true}
                rotateEnabled={false}
            >
            </MapView>

            <View style={styles.centerMarkerContainer}>
                <Animated.View
                    style={[
                        styles.centerMarker,
                        {
                            transform: [
                                {
                                    translateY: mapAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -20],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <MaterialIcons name="place" size={48} color={THEME.colors.primary}/>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.markerShadow,
                        {
                            transform: [
                                {
                                    scale: mapAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 0.5],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            </View>

            <TouchableOpacity
                style={[styles.locationButton, locationLoading && styles.locationButtonLoading]}
                onPress={getUserLocation}
                disabled={locationLoading}
            >
                {locationLoading ? (
                    <ActivityIndicator size="small" color={THEME.colors.primary}/>
                ) : (
                    <MaterialIcons name="my-location" size={24} color={THEME.colors.primary}/>
                )}
            </TouchableOpacity>

            {activateAddressDetails && (
                <BlurView
                    intensity={20}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                />
            )}

            {!activateAddressDetails && (
                <View style={[styles.addressPreviewContainer]}>
                    <View style={styles.addressPreviewContent}>
                        {isReverseGeocoding ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#50703C"/>
                                <Text style={styles.loadingText}>Getting address...</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.addressTextContainer}>
                                    <Text style={styles.addressMainText}>
                                        {selectedAddress.street || 'Move the map to select location'}
                                    </Text>
                                    <Text style={styles.addressSubText}>
                                        {[
                                            selectedAddress.district,
                                            selectedAddress.province,
                                            selectedAddress.postalCode,
                                        ]
                                            .filter(Boolean)
                                            // Remove duplicates in case similar values are set
                                            .filter((value, index, self) => self.indexOf(value) === index)
                                            .join(', ') || 'Address details will appear here'}
                                    </Text>
                                </View>
                                <CustomButton
                                    onPress={() => {
                                        setActivateAddressDetails(true);
                                        animateForm(true);
                                    }}
                                    title="Select"
                                    variant="green"
                                    style={styles.selectButton}
                                    disabled={!selectedAddress.street}
                                />
                            </>
                        )}
                    </View>
                </View>
            )}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Animated.View
                    style={[
                        styles.formContainer,
                        {
                            opacity: contentOpacity,
                            transform: [
                                {
                                    translateY: contentOpacity.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [height, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.formHeader}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => {
                                    setActivateAddressDetails(false);
                                    animateForm(false);
                                }}
                            >
                                <Ionicons name="chevron-back" size={24} color={THEME.colors.primary}/>
                                <Text style={styles.backButtonText}>Back to Map</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContent}>
                            <BaseInput
                                value={selectedAddress.title}
                                onChangeText={(text) => handleInputChange('title', text)}
                                placeholder="Address Title (e.g., Home, Work)"
                                leftIcon={<FontAwesome6 name="address-card" size={20} color={THEME.colors.primary}/>}
                            />
                            {errors.title ? (
                                <Text style={styles.errorText}>{errors.title}</Text>
                            ) : null}

                            <View style={styles.addressDetailsContainer}>
                                <Text style={styles.addressDetailsTitle}>Selected Location</Text>
                                <Text style={styles.addressDetailsText}>{selectedAddress.street}</Text>
                                <Text style={styles.addressDetailsSubText}>
                                    {[
                                        selectedAddress.district,
                                        selectedAddress.province,
                                        selectedAddress.postalCode,
                                    ]
                                        .filter(Boolean)
                                        .filter((value, index, self) => self.indexOf(value) === index)
                                        .join(', ')}
                                </Text>
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={styles.inputHalf}>
                                    <BaseInput
                                        value={selectedAddress.apartmentNo}
                                        onChangeText={(text) => handleInputChange('apartmentNo', text)}
                                        placeholder="Apt No"
                                        keyboardType="numeric"
                                        leftIcon={<MaterialIcons name="apartment" size={20}
                                                                 color={THEME.colors.primary}/>}
                                    />
                                    {errors.apartmentNo ? (
                                        <Text style={styles.errorText}>{errors.apartmentNo}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.inputHalf}>
                                    <BaseInput
                                        value={selectedAddress.doorNo}
                                        onChangeText={(text) => handleInputChange('doorNo', text)}
                                        placeholder="Door No"
                                        leftIcon={<MaterialCommunityIcons name="door" size={20}
                                                                          color={THEME.colors.primary}/>}
                                    />
                                    {errors.doorNo ? (
                                        <Text style={styles.errorText}>{errors.doorNo}</Text>
                                    ) : null}
                                </View>
                            </View>

                            <View style={styles.additionalInfoContainer}>
                                <Text style={styles.additionalInfoText}>
                                    Coordinates: {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
                                </Text>
                                <Text style={styles.lastUpdatedText}>
                                    Last updated: {new Date().toLocaleTimeString()}
                                </Text>
                            </View>

                            <CustomButton
                                onPress={handleAddressConfirm}
                                title={isEditing ? 'Update Address' : 'Confirm Address'}
                                variant="green"
                                style={[styles.confirmButton, {marginBottom: insets.bottom}]}

                            />
                        </View>
                    </ScrollView>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default AddressScreen;

// ------------------------------------------------------------------------
// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    addressPreviewContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minHeight: 100,
    },
    addressPreviewContent: {},
    addressTextContainer: {
        flex: 1,
        marginRight: 16,
    },
    addressMainText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#1A1A1A',
    },
    addressSubText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666666',
        marginTop: 4,
    },
    locationButton: {
        position: 'absolute',
        bottom: 180,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    locationButtonLoading: {
        opacity: 0.7,
    },
    centerMarkerContainer: {
        position: 'absolute',
        top: '53%',
        left: '50%',
        bottom: '42.9%',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{translateX: -24}, {translateY: -48}],
    },
    centerMarker: {
        zIndex: 2,
    },
    markerShadow: {
        position: 'absolute',
        bottom: -5,
        width: 20,
        height: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        opacity: 0.3,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 16,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    formScroll: {
        flex: 1,
    },
    formHeader: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#50703C',
        fontFamily: 'Poppins-Medium',
    },
    formContent: {
        padding: 16,
    },
    addressDetailsContainer: {
        marginVertical: 16,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    addressDetailsTitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
        fontFamily: 'Poppins-Regular',
    },
    addressDetailsText: {
        fontSize: 16,
        color: '#1A1A1A',
        fontFamily: 'Poppins-Medium',
    },
    addressDetailsSubText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    inputHalf: {
        flex: 1,
    },
    additionalInfoContainer: {
        marginVertical: 16,
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
    },
    additionalInfoText: {
        fontSize: 12,
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    lastUpdatedText: {
        fontSize: 12,
        color: '#999999',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    confirmButton: {
        marginTop: 24,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#1A1A1A',
        fontFamily: 'Poppins-Regular',
    },
    selectButton: {
        left: 0,
        right: 0,
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
});
