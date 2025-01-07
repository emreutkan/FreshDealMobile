import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import MapView, {Region} from 'react-native-maps';
import * as Location from 'expo-location';
import {MaterialIcons} from '@expo/vector-icons';
import debounce from 'lodash.debounce';
import {Address} from '@/store/slices/addressSlice';
import {addAddressAsync} from '@/store/thunks/addressThunks';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import {AppDispatch, store} from '@/store/store';
import {useNavigation} from '@react-navigation/native';
import DefaultButton from '@/src/features/DefaultButton';
import InputField from '@/src/features/DefaultInput';

class TempAddress {
    id: string | undefined;
    title: string | undefined;
    latitude: number | undefined;
    longitude: number | undefined;
    street: string | undefined;
    neighborhood: string | undefined;
    district: string | undefined;
    province: string | undefined;
    country: string | undefined;
    postalCode: string | undefined;
    apartmentNo: string | undefined;
    doorNo: string | undefined;
}

const AddressSelectionScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);
    const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [activateAddressDetails, setActivateAddressDetails] = useState<boolean>(false);

    const [selectedAddress, setSelectedAddress] = useState<TempAddress>({
        id: '',
        title: '',
        latitude: 0,
        longitude: 0,
        street: '',
        neighborhood: '',
        district: '',
        province: '',
        country: '',
        postalCode: '',
        apartmentNo: '',
        doorNo: '',
    });

    const [region, setRegion] = useState<Region>({
        latitude: 38.454985,
        longitude: 27.100052,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const token = store.getState().user.token;
    const [errors, setErrors] = useState({
        title: '',
        apartmentNo: '',
        doorNo: ''
    });

// Add validation functions
    const validateApartmentNo = (value: string) => {
        if (value && !/^\d+$/.test(value)) {
            return 'Apartment number must contain only digits';
        }
        return '';
    };

    const validateTitle = (value: string) => {
        if (!value.trim()) {
            return 'Title is required';
        }
        return '';
    };
    const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
    const {height, width} = Dimensions.get('window');
    const [mapAnimation] = useState(new Animated.Value(0));

    const animatedMapTranslateY = mapAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.25],
    });

    const animatedFormTranslateY = mapAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.25],
    });

    useEffect(() => {
        Animated.timing(mapAnimation, {
            toValue: activateAddressDetails ? 1 : 0,
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
        }).start();
    }, [activateAddressDetails]);

    const fetchLocation = async () => {
        try {
            const {status: existingStatus} = await Location.getForegroundPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Location.requestForegroundPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
                setInitialLoading(false);
                setLocationLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
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

            setInitialLoading(false);
            setLocationLoading(false);
        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'An error occurred while fetching the location.');
            setInitialLoading(false);
            setLocationLoading(false);
        }
    };

    const getUserLocation = async () => {
        if (locationLoading) return;
        setLocationLoading(true);
        await fetchLocation();
    };

    useEffect(() => {
        (async () => {
            await fetchLocation();
        })();
    }, []);


// Update the handleAddressChange function to include better validation
    const handleAddressChange = (field: keyof Address, value: string) => {
        // Don't allow empty strings for required fields
        if (['title', 'street', 'district', 'province', 'country'].includes(field) && !value.trim()) {
            setErrors(prev => ({
                ...prev,
                [field]: `${field} is required`
            }));
            return;
        }

        // Validate apartment number
        if (field === 'apartmentNo' && value) {
            if (!/^\d+$/.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    apartmentNo: 'Apartment number must contain only digits'
                }));
                return;
            }
        }

        // Clear error if validation passes
        setErrors(prev => ({
            ...prev,
            [field]: ''
        }));

        // Update the address
        setSelectedAddress(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddressConfirm = async () => {
        const {id, ...addressPayload} = selectedAddress;

        // Validate required fields first
        const requiredFields = {
            title: addressPayload.title,
            street: addressPayload.street,
            district: addressPayload.district,
            province: addressPayload.province,
            country: addressPayload.country,
            postalCode: addressPayload.postalCode
        };

        // Check for empty required fields
        const emptyFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value || value.toString().trim() === '')
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            Alert.alert(
                'Missing Information',
                `Please fill in the following fields: ${emptyFields.join(', ')}`
            );
            return;
        }

        // Validate numeric fields
        if (addressPayload.apartmentNo && !(/^\d+$/.test(addressPayload.apartmentNo.toString()))) {
            Alert.alert('Invalid Input', 'Apartment number must contain only digits');
            return;
        }

        // Format the address payload
        const formattedPayload = {
            ...addressPayload,
            // Convert numeric fields
            apartmentNo: addressPayload.apartmentNo ? parseInt(addressPayload.apartmentNo.toString()) : null,
            postalCode: addressPayload.postalCode ? parseInt(addressPayload.postalCode.toString()) : null,
            // Ensure boolean value
            // Ensure numeric coordinates
            latitude: Number(addressPayload.latitude),
            longitude: Number(addressPayload.longitude)
        };

        try {
            if (!token) {
                throw new Error('Authentication token is not available');
            }

            const result = await dispatch(addAddressAsync(formattedPayload)).unwrap();

            if (result && result.success) {
                console.log('Address added successfully:', result);
                navigation.goBack();
            } else {
                throw new Error(result?.message || 'Failed to add address');
            }
        } catch (error: any) {
            console.error('Failed to add address:', error);
            Alert.alert(
                'Error',
                error?.message || 'An unexpected error occurred while adding the address'
            );
        }
    };
    const handleAddressUpdate = async (latitude: number, longitude: number) => {
        try {
            setIsReverseGeocoding(true);
            const [addressData] = await Location.reverseGeocodeAsync({latitude, longitude});
            if (addressData) {
                setSelectedAddress((prev) => ({
                    ...prev,
                    street: addressData.street || '',
                    neighborhood: addressData.subregion || '',
                    district: addressData.city || '',
                    province: addressData.region || '',
                    country: addressData.country || '',
                    postalCode: addressData.postalCode || '',
                    latitude: latitude,
                    longitude: longitude,
                }));
            } else {
                Alert.alert('No Address Found', 'Unable to retrieve address for the selected location.');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            Alert.alert('Error', 'An error occurred while fetching the address.');
        } finally {
            setIsReverseGeocoding(false);
        }
    };

    const debouncedHandleAddressUpdate = useRef(
        debounce(async (latitude: number, longitude: number) => {
            await handleAddressUpdate(latitude, longitude);
        }, 500)
    ).current;

    useEffect(() => {
        return () => {
            debouncedHandleAddressUpdate.cancel();
        };
    }, []);


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        mapContainer: {
            flex: 1,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            overflow: 'hidden',
        },
        formWrapper: {
            marginTop: scaleFont(12),
            paddingTop: scaleFont(40),

            // padding: scaleFont(10),
            backgroundColor: '#fff',
            borderRadius: 10,
            // overflow: 'visible', // Ensure contents are not clipped
            paddingHorizontal: scaleFont(12),

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
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
            backgroundColor: '#000', // Ensure button is visible
        },
        addressPreviewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: scaleFont(20),
            marginTop: scaleFont(10),
            marginBottom: scaleFont(40),
        },
        addressSubText: {
            paddingTop: scaleFont(2),
            color: 'gray',
            fontWeight: '500',
            fontSize: scaleFont(14),
        },
        addressLoadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(136,136,136,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginLeft: 8,
        },
        loadingText: {
            marginTop: 5,
            fontSize: 14,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        },
        textContainer: {
            flex: 0.5,
            marginRight: scaleFont(8),
        },
        addressText: {
            fontSize: scaleFont(16),
            fontWeight: 'bold',
        },
        selectButton: {
            flex: 0.5,
        },
        additionalFields: {
            maxWidth: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: scaleFont(10),
        },
        inputContainer: {
            marginBottom: scaleFont(10),
        },
    });

    const toggleAddressDetails = () => {
        setActivateAddressDetails(prevState => !prevState);
    };

    const mapOnTouchEvent = () => {
        setIsMapInteracted(true);
        setActivateAddressDetails(false);
    };
    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff"/>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.mapContainer,
                    {
                        width: width,
                        transform: [{translateY: animatedMapTranslateY}],
                    },
                ]}
            >
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={async (newRegion: Region) => {
                        if (isMapInteracted) {
                            setRegion(newRegion);
                            const {latitude, longitude} = newRegion;
                            const result = await debouncedHandleAddressUpdate(latitude, longitude);
                            if (result) {
                                console.log('Debounced address update completed.');
                            }
                        }
                    }}

                    onTouchStart={mapOnTouchEvent}
                    mapType="terrain"
                    showsUserLocation={true}
                    followsUserLocation={false}
                />
                <View style={styles.centerMarker}>
                    <MaterialIcons name="place" size={48} color="#FF0000"/>
                </View>

                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={getUserLocation}
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
            </Animated.View>

            {!activateAddressDetails && (
                <View style={styles.addressPreviewContainer}>
                    <View style={{flex: 1}}>
                        <Text style={styles.addressText}>
                            {`${selectedAddress.street} ${selectedAddress.district} ${selectedAddress.postalCode}`}
                        </Text>
                        <Text style={styles.addressSubText}>
                            {`${selectedAddress.province} ${selectedAddress.country}`}
                        </Text>
                    </View>
                    {isReverseGeocoding && (
                        <View style={styles.addressLoadingOverlay}>
                            <ActivityIndicator size="small" color="#0000ff"/>
                            <Text style={styles.loadingText}>Fetching address...</Text>
                        </View>
                    )}
                    <View style={styles.selectButton}>
                        <DefaultButton
                            onPress={toggleAddressDetails}
                            title={'Select'}
                        />
                    </View>
                </View>
            )}

            {activateAddressDetails && (
                <Animated.View
                    style={[
                        styles.formWrapper,
                        {
                            flex: 1,
                            transform: [{translateY: animatedFormTranslateY}],
                        },
                    ]}
                >

                    <ScrollView
                        scrollEnabled={false}>

                        <View style={styles.addressPreviewContainer}>
                            <View style={{flex: 1}}>
                                <Text style={styles.addressText}>
                                    {`${selectedAddress.street} ${selectedAddress.district} ${selectedAddress.postalCode}`}
                                </Text>
                                <Text style={styles.addressSubText}>
                                    {`${selectedAddress.province} ${selectedAddress.country}`}
                                </Text>
                            </View>

                        </View>
                        <View style={styles.inputContainer}>
                            <InputField
                                placeholder="Title *"
                                value={selectedAddress.title}
                                borderColor={errors.title ? '#ff0000' : '#b0f484'}
                                onChange={(text) => handleAddressChange('title', text)}
                                error={errors.title}
                            />
                            {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
                        </View>

                        <View style={styles.additionalFields}>
                            <InputField
                                placeholder="Apt No"
                                value={selectedAddress.apartmentNo?.toString()}
                                borderColor={errors.apartmentNo ? '#ff0000' : '#b0f484'}
                                onChange={(text) => handleAddressChange('apartmentNo', text)}
                                error={errors.apartmentNo}
                                keyboardType="numeric"
                            />
                            {errors.apartmentNo ? <Text style={styles.errorText}>{errors.apartmentNo}</Text> : null}

                            <InputField
                                placeholder="Door No"
                                value={selectedAddress.doorNo}
                                borderColor={errors.doorNo ? '#ff0000' : '#b0f484'}
                                onChange={(text) => handleAddressChange('doorNo', text)}
                                error={errors.doorNo}
                            />
                            {errors.doorNo ? <Text style={styles.errorText}>{errors.doorNo}</Text> : null}
                        </View>

                        <DefaultButton onPress={handleAddressConfirm} title={'Confirm Address'}/>
                    </ScrollView>
                </Animated.View>
            )}

        </View>
    );
};

export default AddressSelectionScreen;
