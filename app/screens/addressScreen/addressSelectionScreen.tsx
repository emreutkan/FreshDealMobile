////////////////////////////
//         Imports        //
////////////////////////////
import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Easing,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import MapView, {Region} from 'react-native-maps';
import * as Location from 'expo-location';
import {MaterialIcons} from '@expo/vector-icons';
import LoginButton from '@/components/LoginScreenComponents/loginButton'; // Keep only one import
import debounce from 'lodash.debounce';
import {scaleFont} from '@/components/utils/ResponsiveFont';
import {addAddressAsync, Address} from "@/store/userSlice";
import {AppDispatch} from "@/store/store";
import {router} from "expo-router";
import {useNavigationState} from "@react-navigation/core";
import InputField from "@/components/defaultInput";


////////////////////////////
//   Main Screen Component
////////////////////////////
const AddressSelectionScreen: React.FC = () => {

    ////////////////////////////
    //    Hooks & References  //
    ////////////////////////////
    const {height, width} = Dimensions.get('window');
    const [mapAnimation] = useState(new Animated.Value(0));
    const navigationState = useNavigationState((state) => state);
    const dispatch = useDispatch<AppDispatch>();
    const mapRef = useRef<MapView>(null);

    ////////////////////////////
    //       State Hooks      //
    ////////////////////////////
    const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [activateAddressDetails, setActivateAddressDetails] = useState<boolean>(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false); // loading for reverse geocoding

    const [selectedAddress, setSelectedAddress] = useState<Address>({
        id: '', // Initialize id
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

    ////////////////////////////
    //     Animations         //
    ////////////////////////////
    // Interpolation for map's translateY
    const animatedMapTranslateY = mapAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.55],
    });

    // Interpolation for formWrapper's translateY
    const animatedFormTranslateY = mapAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.55],
    });

    // Animate when activateAddressDetails changes
    useEffect(() => {
        Animated.timing(mapAnimation, {
            toValue: activateAddressDetails ? 1 : 0,
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
        }).start();
    }, [activateAddressDetails]);

    /////////////////////////////////
    //    Location & Address Ops   //
    /////////////////////////////////
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

    // Initial location fetch
    useEffect(() => {
        fetchLocation();
    }, []);

    /////////////////////////////////
    //   Address Change Handlers   //
    /////////////////////////////////
    const handleAddressChange = (field: keyof Address, value: string) => {
        setSelectedAddress(prevAddress => ({
            ...prevAddress,
            [field]: value,
        }));
    };

    const handleAddressConfirm = async () => {
        const {id, ...addressPayload} = selectedAddress;
        // Basic validation
        if (!addressPayload.street || !addressPayload.district || !addressPayload.postalCode) {
            Alert.alert('Error', 'Please fill in all required fields (Street, City, Postal Code).');
            return;
        }
        try {
            console.log('Submitting address:', addressPayload);
            try {
                const result = await dispatch(addAddressAsync(addressPayload)).unwrap();
                if (result) {
                    console.log('Address added successfully:', result);
                }
            } catch (error) {
                console.error('Failed to add address:', error);
                setSelectedAddress({
                    id: '',
                    street: '',
                    neighborhood: '',
                    district: '',
                    province: '',
                    country: '',
                    postalCode: '',
                    apartmentNo: '',
                    doorNo: '',
                    latitude: 0,
                    longitude: 0,
                    title: ''
                });
            }
            setActivateAddressDetails(false);
        } catch (error) {
            setSelectedAddress({
                id: '',
                street: '',
                neighborhood: '',
                district: '',
                province: '',
                country: '',
                postalCode: '',
                apartmentNo: '',
                doorNo: '',
                latitude: 0,
                longitude: 0,
                title: ''
            });
            console.error('Address submission failed:', error);
            // @ts-ignore
            Alert.alert('Error', error || 'Failed to add the address. Please try again.');
        }
        handleBack();
    };

    /////////////////////////////////
    //       Navigation Ops        //
    /////////////////////////////////
    const handleBack = () => {
        const prevScreen = navigationState.routes[navigationState.index - 1]?.name;
        console.log('Previous screen:', prevScreen);
        if (prevScreen && prevScreen !== 'screens/preLogin') {
            router.back();
        } else {
            console.log('Already at LoginPage, cannot go back.');
        }
    };

    /////////////////////////////////
    //   Reverse Geocode Handling  //
    /////////////////////////////////
    const handleAddressUpdate = async (latitude: number, longitude: number) => {
        try {
            setIsReverseGeocoding(true);
            const [addressData] = await Location.reverseGeocodeAsync({latitude, longitude});
            if (addressData) {
                setSelectedAddress({
                    id: '',
                    title: '',
                    street: addressData.street || '',
                    neighborhood: addressData.subregion || '',
                    district: addressData.city || '',
                    province: addressData.region || '',
                    country: addressData.country || '',
                    postalCode: addressData.postalCode || '',
                    apartmentNo: '',
                    doorNo: '',
                    latitude: latitude,
                    longitude: longitude
                });
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

    // Debounced version
    const debouncedHandleAddressUpdate = useRef(
        debounce(async (latitude: number, longitude: number) => {
            await handleAddressUpdate(latitude, longitude);
        }, 500)
    ).current;

    // Cleanup debounce
    useEffect(() => {
        return () => {
            debouncedHandleAddressUpdate.cancel();
        };
    }, []);


    /////////////////////////////////
    //        UI Interactions      //
    /////////////////////////////////
    const toggleAddressDetails = () => {
        setActivateAddressDetails(prevState => !prevState);
    };

    const mapOntouchEvent = () => {
        setIsMapInteracted(true);
        setActivateAddressDetails(false);
    };

    /////////////////////////////////
    //           Styles            //
    /////////////////////////////////
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            maxWidth: '100%', // Use percentage for width
            backgroundColor: 'rgb(239,235,235)',
            borderWidth: 12
        },
        mapContainer: {
            flex: 0.85,
            borderBottomLeftRadius: 20,
            borderWidth: 0,
            borderBottomRightRadius: 20,
            overflow: 'hidden',
        },
        formWrapper: {
            marginVertical: scaleFont(16),
            flex: 0.1,
            paddingHorizontal: scaleFont(16),
            gap: scaleFont(16),
        },
        belowMap: {
            paddingVertical: scaleFont(8),
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
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        addressPreviewContainer: {
            marginHorizontal: scaleFont(16),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        addressText: {},
        addressSubText: {
            color: 'gray',
            fontWeight: '300',
            fontSize: 12,
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
        input: {
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            fontSize: 16,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        },
        reverseGeocodingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginButton: {
            width: '35%',
            borderWidth: 1,
            marginLeft: scaleFont(8)
        }
    });

    /////////////////////////////////
    //         Render Logic        //
    /////////////////////////////////
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
                ]}>
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
                    onTouchStart={() => mapOntouchEvent()}
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

            <KeyboardAvoidingView
                style={styles.formWrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                {!activateAddressDetails && (
                    <View style={styles.belowMap}>
                        <View style={styles.addressPreviewContainer}>
                            <View>
                                <Text
                                    style={styles.addressText}>{`${selectedAddress.street}, ${selectedAddress.district} ${selectedAddress.postalCode}`}</Text>
                                <Text
                                    style={styles.addressSubText}>{`${selectedAddress.province}, ${selectedAddress.country}`}</Text>
                            </View>
                            {isReverseGeocoding && (
                                <View style={styles.addressLoadingOverlay}>
                                    <ActivityIndicator size="small" color="#0000ff"/>
                                    <Text style={styles.loadingText}>Fetching address...</Text>
                                </View>
                            )}
                            <View style={styles.loginButton}>
                                <LoginButton
                                    onPress={toggleAddressDetails}
                                    title={'Select'}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {activateAddressDetails && (
                    <Animated.View
                        style={[
                            styles.formWrapper,
                            {
                                transform: [{translateY: animatedFormTranslateY}],
                            },
                        ]}
                    >
                        <View>
                            <View style={{marginBottom: 12}}>
                                <Text style={{fontSize: scaleFont(16), fontWeight: '600'}}>
                                    {selectedAddress.street || 'Street name'}
                                    {!!selectedAddress.street && ' ' + selectedAddress.district}
                                    {!!selectedAddress.postalCode && ' ' + selectedAddress.postalCode}
                                </Text>

                                <Text style={{fontSize: scaleFont(16), fontWeight: '400'}}>
                                    {selectedAddress.province}, {selectedAddress.country}
                                </Text>
                                <View style={{flexDirection: 'column'}}>
                                    <InputField
                                        placeholder="Title"

                                        value={selectedAddress.title}
                                        onChange={(text) => handleAddressChange('title', text)}
                                    />
                                    <View style={{flexDirection: 'row'}}>
                                        <InputField
                                            placeholder="Apt No"

                                            value={selectedAddress.apartmentNo}
                                            onChange={(text) => handleAddressChange('apartmentNo', text)}
                                        />
                                        <InputField
                                            placeholder="Door No"

                                            value={selectedAddress.doorNo}
                                            onChange={(text) => handleAddressChange('doorNo', text)}
                                        />
                                    </View>
                                </View>

                            </View>

                            <LoginButton onPress={handleAddressConfirm} title={'Confirm Address'}/>

                        </View>

                    </Animated.View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default AddressSelectionScreen;
