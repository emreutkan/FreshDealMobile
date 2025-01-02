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
import {addAddressAsync, Address} from "@/store/userSlice";
import {scaleFont} from "@/app/utils/ResponsiveFont";
import store, {AppDispatch} from "@/store/store";
import {router} from "expo-router";
import {useNavigationState} from "@react-navigation/core";
import DefaultButton from "@/app/features/DefaultButton";
import InputField from "@/app/features/DefaultInput";

const AddressSelectionScreen: React.FC = () => {
    const navigationState = useNavigationState((state) => state);
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);
    const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [activateAddressDetails, setActivateAddressDetails] = useState<boolean>(false);

    const [selectedAddress, setSelectedAddress] = useState<Address>({
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
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const token = store.getState().user.token; // Directly access the token from the store.

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
        fetchLocation();
    }, []);

    const handleAddressChange = (field: keyof Address, value: string) => {
        setSelectedAddress(prevAddress => ({
            ...prevAddress,
            [field]: value,
        }));
    };

    const handleAddressConfirm = async () => {
        const {id, ...addressPayload} = selectedAddress;

        if (!addressPayload.street || !addressPayload.district || !addressPayload.postalCode) {
            Alert.alert('Error', 'Please fill in all required fields (Street, City, Postal Code).');
            return;
        }

        try {
            console.log('Submitting address:', addressPayload);
            try {

                if (!token) {
                    console.log("Token is not set. Cannot add address.");
                    console.log('store.getState().user.token = ', store.getState().user.token)
                    return
                }
                const result = await dispatch(addAddressAsync(addressPayload)).unwrap();

                if (result) {
                    console.log('Address added successfully:', result);
                }
            } catch (error) {
                console.error('Failed to add address:', error);
                setSelectedAddress({
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
            }

            setActivateAddressDetails(false);
        } catch (error) {
            setSelectedAddress({
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
            console.error('Address submission failed:', error);
            Alert.alert('Error', 'Failed to add the address. Please try again.');
        }
        handleBack();
    };

    const handleBack = () => {
        const prevScreen = navigationState.routes[navigationState.index - 1]?.name;
        console.log('Previous screen:', prevScreen);
        if (prevScreen && prevScreen !== 'features/LoginRegister/screens') {
            router.back();
        } else {
            console.log('Already at LoginPage, cannot go back.');
        }
    };

    const handleAddressUpdate = async (latitude: number, longitude: number) => {
        try {
            setIsReverseGeocoding(true);
            const [addressData] = await Location.reverseGeocodeAsync({latitude, longitude});
            if (addressData) {
                setSelectedAddress(prev => ({
                    ...prev,
                    street: addressData.street || '',
                    neighborhood: addressData.subregion || '',
                    district: addressData.city || '',
                    province: addressData.region || '',
                    country: addressData.country || '',
                    postalCode: addressData.postalCode || '',
                }));
                handleAddressChange('latitude', latitude.toString())
                handleAddressChange('longitude', longitude.toString())

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

    const toggleAddressDetails = () => {
        setActivateAddressDetails(prevState => !prevState);
    };

    const mapOntouchEvent = () => {
        setIsMapInteracted(true);
        setActivateAddressDetails(false);
    };

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
                    onRegionChangeComplete={(newRegion: Region) => {
                        if (isMapInteracted) {
                            setRegion(newRegion);
                            const {latitude, longitude} = newRegion;
                            debouncedHandleAddressUpdate(latitude, longitude);
                        }
                    }}
                    onTouchStart={mapOntouchEvent}
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
                                placeholder="Title"
                                value={selectedAddress.title}
                                borderColor='#b0f484'
                                onChange={(text) => handleAddressChange('title', text)

                                }
                            />
                        </View>

                        <View style={styles.additionalFields}>
                            <InputField
                                placeholder="Apt No"
                                value={selectedAddress.apartmentNo}
                                borderColor='#b0f484'
                                onChange={(text) => handleAddressChange('apartmentNo', text)}
                            />
                            <InputField
                                placeholder="Door No"
                                value={selectedAddress.doorNo}
                                borderColor='#b0f484'
                                onChange={(text) => handleAddressChange('doorNo', text)}
                            />
                        </View>

                        <DefaultButton onPress={handleAddressConfirm} title={'Confirm Address'}/>
                    </ScrollView>
                </Animated.View>
            )}

        </View>
    );
};

export default AddressSelectionScreen;
