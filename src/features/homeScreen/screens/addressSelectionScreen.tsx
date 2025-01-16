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
import {addAddressAsync} from '@/src/redux/thunks/addressThunks';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import {AppDispatch, store} from '@/src/redux/store';
import {useNavigation} from '@react-navigation/native';
import InputField from '@/src/features/DefaultInput';
import {Address} from "@/src/types/api/address/model"
import {ButtonStyles, THEME} from "@/src/styles/ButtonStyles";


class TempAddress {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
    doorNo: string;
    is_primary: boolean;

    constructor() {
        this.id = '';
        this.title = '';
        this.latitude = 0;
        this.longitude = 0;
        this.street = '';
        this.neighborhood = '';
        this.district = '';
        this.province = '';
        this.country = '';
        this.postalCode = '';
        this.apartmentNo = '0';
        this.doorNo = '0';
        this.is_primary = true;
    }
}


const AddressSelectionScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);
    const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [activateAddressDetails, setActivateAddressDetails] = useState<boolean>(false);

    const [selectedAddress, setSelectedAddress] = useState<TempAddress>(new TempAddress());


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


    const handleAddressChange = (field: keyof Address, value: string) => {
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

        setErrors(prev => ({
            ...prev,
            [field]: ''
        }));

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

        if (addressPayload.apartmentNo && !(/^\d+$/.test(addressPayload.apartmentNo.toString()))) {
            Alert.alert('Invalid Input', 'Apartment number must contain only digits');
            return;
        }

        const formattedPayload = {
            ...addressPayload,
            apartmentNo: addressPayload.apartmentNo.toString(),

            latitude: Number(addressPayload.latitude),
            longitude: Number(addressPayload.longitude),
            is_primary: true
        };

        try {
            if (!token) {
                console.log('Authentication token is not available');
            }

            const result = await dispatch(addAddressAsync(formattedPayload)).unwrap();

            if (result) {
                console.log('Address added successfully:', result);
                navigation.goBack();
            } else {
                console.log(result + 'Failed to add address');
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
            backgroundColor: THEME.colors.background,
        },
        mapContainer: {
            flex: 1,
            borderBottomLeftRadius: THEME.radius.xl,
            borderBottomRightRadius: THEME.radius.xl,
            overflow: 'hidden',
            shadowColor: THEME.colors.shadow,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
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
            // Add bounce animation when dropping pin
            transform: [{scale: 1.1}],
        },
        myLocationButton: {
            position: 'absolute',
            bottom: THEME.spacing.lg,
            right: THEME.spacing.lg,
            padding: THEME.spacing.md,
            borderRadius: 30,
            backgroundColor: THEME.colors.background,
            shadowColor: THEME.colors.shadow,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        formWrapper: {
            marginTop: THEME.spacing.sm,
            paddingTop: THEME.spacing.xl,
            backgroundColor: THEME.colors.background,
            borderTopLeftRadius: THEME.radius.xl,
            borderTopRightRadius: THEME.radius.xl,
            paddingHorizontal: THEME.spacing.lg,
            shadowColor: THEME.colors.shadow,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        addressPreviewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: THEME.spacing.lg,
            paddingVertical: THEME.spacing.md,
            backgroundColor: '#f8fafc',
            borderRadius: THEME.radius.lg,
            marginBottom: THEME.spacing.lg,
        },
        addressText: {
            fontSize: scaleFont(16),
            fontFamily: 'Poppins-SemiBold',
            color: THEME.colors.text.primary,
            marginBottom: THEME.spacing.xs,
        },
        addressSubText: {
            fontSize: scaleFont(14),
            fontFamily: 'Poppins-Regular',
            color: THEME.colors.text.secondary,
        },
        addressLoadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: THEME.radius.lg,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: THEME.colors.background,
        },
        loadingText: {
            marginTop: THEME.spacing.sm,
            fontSize: scaleFont(14),
            fontFamily: 'Poppins-Regular',
            color: THEME.colors.text.secondary,
        },
        inputContainer: {
            marginBottom: THEME.spacing.md,
        },
        additionalFields: {
            flexDirection: 'row',
            gap: THEME.spacing.md,
            marginBottom: THEME.spacing.lg,
        },
        selectButton: {
            minWidth: 60,
            maxWidth: 160,
        }
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
                    <MaterialIcons name="place" size={48} color={THEME.colors.primary}/>
                </View>

                <TouchableOpacity
                    style={[
                        styles.myLocationButton,
                        locationLoading && {opacity: 0.7}
                    ]}
                    onPress={getUserLocation}
                    disabled={locationLoading}
                >
                    {locationLoading ? (
                        <ActivityIndicator size="small" color={THEME.colors.primary}/>
                    ) : (
                        <MaterialIcons
                            name="my-location"
                            size={24}
                            color={THEME.colors.primary}
                        />
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
                        <TouchableOpacity
                            onPress={toggleAddressDetails}

                            style={ButtonStyles.defaultGreenButton}

                        >
                            <Text style={ButtonStyles.ButtonText}>
                                Select </Text>
                        </TouchableOpacity>

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
                            />
                        </View>

                        <View style={styles.additionalFields}>
                            <InputField
                                placeholder="Apt No"
                                value={selectedAddress.apartmentNo.toString()}
                                borderColor={errors.apartmentNo ? '#ff0000' : '#b0f484'}
                                onChange={(text) => handleAddressChange('apartmentNo', text)}
                                keyboardType="numeric"
                            />

                            <InputField
                                placeholder="Door No"
                                value={selectedAddress.doorNo}
                                borderColor={errors.doorNo ? '#ff0000' : '#b0f484'}
                                onChange={(text) => handleAddressChange('doorNo', text)}
                            />
                        </View>

                        <TouchableOpacity
                            style={ButtonStyles.defaultGreenButton}
                            onPress={handleAddressConfirm}
                        >
                            <Text style={ButtonStyles.ButtonText}>
                                Confirm Address
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            )}

        </View>
    );
};

export default AddressSelectionScreen;
