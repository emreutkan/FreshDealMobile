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
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import debounce from 'lodash.debounce';
import {addAddressAsync} from '@/src/redux/thunks/addressThunks';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import {AppDispatch} from '@/src/redux/store';
import {useNavigation} from '@react-navigation/native';
import {Address} from "@/src/types/api/address/model"
import {THEME} from "@/src/styles/Theme";
import {tokenService} from "@/src/services/tokenService";
import {CustomButton} from "@/src/features/LoginRegister/components/CustomButton";
import BaseInput from "@/src/features/LoginRegister/components/BaseInput";
import {useSafeAreaInsets} from "react-native-safe-area-context";


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
        this.apartmentNo = '';
        this.doorNo = '';
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

    const token = tokenService.getToken();
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
            console.log('Sending address payload:', formattedPayload);

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

    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, {bottom: insets.bottom}]}>
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

                    <CustomButton onPress={toggleAddressDetails} title={"Select"} variant={"green"} style={{
                        width: '30%',
                    }}/>

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

                        <BaseInput value={selectedAddress.title}
                                   onChangeText={(text) => handleAddressChange('title', text)}
                                   placeholder="Title"
                                   leftIcon={<FontAwesome6 name="address-card" size={20} color="#50703C"/>}/>
                        <BaseInput value={selectedAddress.apartmentNo.toString()}
                                   onChangeText={(text) => handleAddressChange('apartmentNo', text)}
                                   placeholder="Apt No"
                                   keyboardType={"numeric"}
                                   leftIcon={<MaterialIcons name="apartment" size={20} color="#50703C"/>}/>
                        <BaseInput value={selectedAddress.doorNo}
                                   onChangeText={(text) => handleAddressChange('doorNo', text)}
                                   placeholder="Door No"
                                   leftIcon={<MaterialCommunityIcons name="door" size={20} color="#50703C"/>}/>
                        <CustomButton onPress={handleAddressConfirm} title={"Confirm Address"} variant={"green"}/>


                    </ScrollView>
                </Animated.View>
            )}

        </View>
    );
};

export default AddressSelectionScreen;
// The code remains the same until the styles section

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff', // THEME.colors.background
    },
    mapContainer: {
        flex: 1,
        borderBottomLeftRadius: 24, // THEME.radius.xl
        borderBottomRightRadius: 24,
        overflow: 'hidden',
        shadowColor: 'rgba(0, 0, 0, 0.1)', // THEME.colors.shadow
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
        transform: [{scale: 1.1}],
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 24, // THEME.spacing.lg
        right: 24,  // THEME.spacing.lg
        padding: 16, // THEME.spacing.md
        borderRadius: 30,
        backgroundColor: '#ffffff', // THEME.colors.background
        shadowColor: 'rgba(0, 0, 0, 0.1)', // THEME.colors.shadow
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    formWrapper: {
        marginTop: 8, // THEME.spacing.sm
        paddingTop: 32, // THEME.spacing.xl
        backgroundColor: '#ffffff', // THEME.colors.background
        borderTopLeftRadius: 24, // THEME.radius.xl
        borderTopRightRadius: 24,
        paddingHorizontal: 24, // THEME.spacing.lg
        shadowColor: 'rgba(0, 0, 0, 0.1)', // THEME.colors.shadow
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addressPreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24, // THEME.spacing.lg
        paddingVertical: 16, // THEME.spacing.md
        backgroundColor: 'rgba(136,136,136,0.16)',
        borderRadius: 16, // THEME.radius.lg
    },
    addressText: {
        fontSize: scaleFont(16),
        fontFamily: 'Poppins-SemiBold',
        color: '#1e293b', // THEME.colors.text.primary
        marginBottom: 4, // THEME.spacing.xs
    },
    addressSubText: {
        fontSize: scaleFont(14),
        fontFamily: 'Poppins-Regular',
        color: '#64748b', // THEME.colors.text.secondary
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
        borderRadius: 16, // THEME.radius.lg
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // THEME.colors.background
    },
    loadingText: {
        marginTop: 8, // THEME.spacing.sm
        fontSize: scaleFont(14),
        fontFamily: 'Poppins-Regular',
        color: '#64748b', // THEME.colors.text.secondary
    },
    inputContainer: {
        marginBottom: 16, // THEME.spacing.md
    },
    additionalFields: {
        flexDirection: 'row',
        gap: 16, // THEME.spacing.md
        marginBottom: 24, // THEME.spacing.lg
    },
    selectButton: {
        minWidth: 60,
        maxWidth: 160,
    }
});