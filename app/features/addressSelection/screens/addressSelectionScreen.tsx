import React, {useEffect, useState} from 'react';
import {Alert, Animated, Dimensions, Easing, KeyboardAvoidingView, Platform, StyleSheet, View,} from 'react-native';
import {useDispatch} from 'react-redux';
import {router} from 'expo-router';
import {useNavigationState} from '@react-navigation/core';
import {AppDispatch} from '@/store/store';
import {addAddressAsync, Address} from '@/store/userSlice';
import {useLocation} from "@/app/features/addressSelection/hooks/useLocation";
import {useReverseGeocode} from "@/app/features/addressSelection/hooks/useReverseGeocode";
import MapComponent from "@/app/features/addressSelection/components/MapComponent";
import AddressPreview from "@/app/features/addressSelection/components/AddressPreview";
import AddressForm from "@/app/features/addressSelection/components/AddressForm";
import LoadingOverlay from "@/app/features/addressSelection/components/LoadingOverlay";
import {Region} from "react-native-maps";
import {scaleFont} from "@/app/utils/ResponsiveFont";

const AddressSelectionScreen: React.FC = () => {
    const {height, width} = Dimensions.get('window');
    const dispatch = useDispatch<AppDispatch>();
    const navigationState = useNavigationState((state) => state);

    const {location, loading: initialLoading, fetchLocation} = useLocation();

    const {reverseGeocode, isReverseGeocoding} = useReverseGeocode();

    const [activateAddressDetails, setActivateAddressDetails] = useState<boolean>(false);
    const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);
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

    // Animation
    const [mapAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (location) {
            const {latitude, longitude} = location.coords;
            const newRegion: Region = {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            console.log('Setting new region:', newRegion);
            setRegion(newRegion);
        }
    }, [location]);


    useEffect(() => {
        Animated.timing(mapAnimation, {
            toValue: activateAddressDetails ? 1 : 0,
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
        }).start();
    }, [activateAddressDetails]);

    const handleAddressUpdate = async (latitude: number, longitude: number) => {
        console.log('Updating address for coordinates:', latitude, longitude);
        const address = await reverseGeocode(latitude, longitude);
        if (address) {
            console.log('Reverse geocoded address:', address);
            setSelectedAddress(address);
        }
    };

    const handleAddressChange = (field: keyof Address, value: string) => {
        setSelectedAddress((prev) => ({...prev, [field]: value}));
    };

    const handleAddressConfirm = async () => {
        const {id, ...addressPayload} = selectedAddress;
        if (!addressPayload.street || !addressPayload.district || !addressPayload.postalCode) {
            Alert.alert('Error', 'Please fill in all required fields (Street, City, Postal Code).');
            return;
        }
        try {
            const result = await dispatch(addAddressAsync(addressPayload)).unwrap();
            if (result) {
                console.log('Address added successfully:', result);
                setActivateAddressDetails(false);
                handleBack();
            }
        } catch (error) {
            console.error('Failed to add address:', error);
            Alert.alert('Error', 'Failed to add the address. Please try again.');
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
                title: '',
            });
        }
    };

    const handleBack = () => {
        const prevScreen = navigationState.routes[navigationState.index - 1]?.name;
        if (prevScreen && prevScreen !== 'screens/preLogin') {
            router.back();
        } else {
            console.log('Already at LoginPage, cannot go back.');
        }
    };

    const toggleAddressDetails = () => {
        setActivateAddressDetails((prev) => !prev);
    };

    const handleMapInteraction = () => {
        setIsMapInteracted(true);
        setActivateAddressDetails(false);
    };

    if (initialLoading) {
        return <LoadingOverlay/>;
    }

    const animatedMapTranslateY = mapAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.55],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    transform: [{translateY: animatedMapTranslateY}],
                    flex: 1,
                }}
            >
                <MapComponent
                    region={region}
                    setRegion={setRegion}
                    onMapInteraction={handleMapInteraction}
                    onAddressUpdate={handleAddressUpdate}
                    isReverseGeocoding={isReverseGeocoding}
                    fetchLocation={fetchLocation}
                    locationLoading={initialLoading} // Correctly pass the loading state
                />
            </Animated.View>


            {!activateAddressDetails ? (
                <KeyboardAvoidingView
                    style={styles.selectedAddressDisplay}

                >
                    <AddressPreview
                        address={selectedAddress}
                        onSelect={toggleAddressDetails}
                        isLoading={isReverseGeocoding}
                    />
                </KeyboardAvoidingView>

            ) : (
                <KeyboardAvoidingView
                    style={styles.inputContent}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <AddressForm
                        address={selectedAddress}
                        onChange={handleAddressChange}
                        onConfirm={handleAddressConfirm}
                    />
                </KeyboardAvoidingView>

            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: '100%',
        backgroundColor: 'rgb(239,235,235)',
    },
    selectedAddressDisplay: {
        flex: 0.15,
        paddingHorizontal: scaleFont(16)
    },
    inputContent: {
        // paddingHorizontal: scaleFont(16)
    },
});

export default AddressSelectionScreen;
