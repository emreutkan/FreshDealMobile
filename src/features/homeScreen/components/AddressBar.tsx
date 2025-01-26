// components/LoginScreenComponents/AddressBar.tsx

import React, {useMemo, useRef, useState} from 'react';
import {Animated, FlatList, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";

import {deleteAddressAsync, setPrimaryAddress} from "@/src/redux/thunks/addressThunks";
import {RootStackParamList} from '@/src/utils/navigation';
import {Address} from "@/src/types/api/address/model"
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

interface AddressBarProps {
    textColor: Animated.AnimatedInterpolation<string> | string;
}

const AddressBar: React.FC<AddressBarProps> = ({textColor}) => {
    const dispatch = useDispatch<AppDispatch>();
    type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UpdateAddress'>;

    const navigation = useNavigation<NavigationProp>();

    const addresses = useSelector((state: RootState) => {
        return state.address.addresses;
    });


    const selectedAddressID = useSelector(
        (state: RootState) => state.address.selectedAddressId
    );

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '50%', "50%"], []);

    const [textWidth, setTextWidth] = useState<number>(0);

    const handlePresentModal = () => {
        bottomSheetRef.current?.present();
    };

    const handleDismissModal = () => {
        bottomSheetRef.current?.dismiss();
    };
    // ===== Handlers =====
    const handleAddressSelect = async (address: Address) => {
        try {
            await dispatch(setPrimaryAddress(address.id)).unwrap();
            console.log('Primary address set:', address);
            handleDismissModal();
        } catch (error) {
            console.error('Failed to set primary address:', error);
        }
    };

    const handleConfigureAddress = (addressId: string) => {
        handleDismissModal();
        const address = addresses.find((addr) => addr.id === addressId);
        navigation.navigate('AddressSelectionScreen', {addressToEdit: address});
    };

    const handleAddNewAddress = () => {
        handleDismissModal();
        navigation.navigate('AddressSelectionScreen', {addressToEdit: undefined});
    };
    const handleRemoveAddress = (addressId: string) => {
        dispatch(deleteAddressAsync(addressId));
    };


    const renderAddressStreet = () => {
        let selectedAddress = addresses.find((addr) => addr.id === selectedAddressID);
        if (!selectedAddress) return 'Select an address';
        return `${selectedAddress.street}`;

    };

    const renderAddressDistrict = () => {
        let selectedAddress = addresses.find((addr) => addr.id === selectedAddressID);
        if (!selectedAddress) return 'Select an address';
        return `${selectedAddress.district}`;

    };

    const renderAddressItem = ({item}: { item: Address }) => {
        const isSelected = item.id === selectedAddressID;

        return (
            <View
                style={[
                    styles.addressItemContainer,
                    isSelected && styles.selectedAddressItem,
                ]}
            >
                <TouchableOpacity
                    onPress={() => handleAddressSelect(item)}
                    style={styles.addressOption}
                    accessibilityLabel="Select Address"
                    accessibilityHint={`Select the address at ${item.street}, ${item.district}`}
                >
                    <Text style={styles.addressOptionText}>

                        {`${item.street}, ${item.district}, ${item.province}`}

                    </Text>
                </TouchableOpacity>

                <View style={styles.actionIcons}>
                    <TouchableOpacity
                        onPress={() => handleConfigureAddress(item.id)}
                        style={styles.configureIconContainer}
                        accessibilityLabel={`Configure address at ${item.street}`}
                    >
                        <Ionicons name="create-outline" size={20} color="#50703C"/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleRemoveAddress(item.id)}
                        style={styles.trashIconContainer}
                        accessibilityLabel={`Remove address at ${item.street}`}
                        accessibilityHint="Removes this address from the list"
                    >
                        <Ionicons name="trash" size={20} color="#FF0000"/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const insets = useSafeAreaInsets()
    return (
        <View style={styles.container}>
            <View style={[styles.addressBar, {minWidth: textWidth + 160}]}>
                <MaterialIcons name="gps-fixed" size={18} color="#4CAF50BE"/>
                <Text
                    style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 16,
                        color: '#2D3748',
                        flexShrink: 1,
                        paddingLeft: 8,
                    }}
                    onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {renderAddressStreet()}
                </Text>
                <Text
                    style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 16,
                        color: '#718096',
                        flexShrink: 1,
                        paddingLeft: 4,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {renderAddressDistrict()}
                </Text>
                <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    style={{marginLeft: 5}}
                    color="#88888867"
                />

                <TouchableOpacity
                    onPress={handlePresentModal}
                    style={styles.touchableOverlay}
                    activeOpacity={1}
                    accessibilityLabel="Open Address Selector"
                    accessibilityHint="Opens a modal to select or add a new address"
                />
            </View>

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose
                index={1}
                enableHandlePanningGesture={true}
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.bottomSheetIndicator}
                android_keyboardInputMode="adjustResize"
                keyboardBehavior="extend"
                enableOverDrag={false}
                enableContentPanningGesture={true}
                style={{paddingBottom: 100}}
            >
                <BottomSheetScrollView contentContainerStyle={
                    [styles.modalContent, {paddingBottom: insets.bottom}]
                }>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Address</Text>
                    </View>

                    {addresses.length > 0 ? (
                        <FlatList
                            data={addresses}
                            keyExtractor={(item) => item.id}
                            renderItem={renderAddressItem}
                            contentContainerStyle={styles.flatListContent}
                        />
                    ) : (
                        <Text style={styles.noAddressesText}>
                            No addresses available.
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={handleAddNewAddress}
                        style={styles.addAddressButton}
                        accessibilityLabel="Add New Address"
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={20}
                            color="#ffffff"
                        />
                        <Text style={styles.addAddressText}>Add New Address</Text>
                    </TouchableOpacity>
                </BottomSheetScrollView>
            </BottomSheetModal>
        </View>
    );
};

export default AddressBar;

const styles = StyleSheet.create({
    container: {}, // Keep this as it's used in the root component
    bottomSheetBackground: {
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // elevation: 5,
    },

    bottomSheetIndicator: {
        backgroundColor: '#50703C',
        width: 40,
        height: 4,
        borderRadius: 2,
    },

    modalContent: {
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',

    },

    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginBottom: 16,
    },

    modalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        color: '#333',
        textAlign: 'center',
        fontWeight: '600',
    },

    addressItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        // elevation: 2,
    },

    selectedAddressItem: {
        backgroundColor: '#e8f5e9',
        borderColor: '#50703C',
        borderWidth: 1,
    },

    addressOptionText: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: '#333',
        flex: 1,
    },

    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 6,
    },

    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#50703C',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        // marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        // elevation: 5,
    },

    addAddressText: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
    },

    configureIconContainer: {
        paddingHorizontal: 8,
        marginRight: 8,
    },

    trashIconContainer: {
        paddingHorizontal: 8,
    },

    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // elevation: 3,
        maxHeight: 60,
        minWidth: 120,
        marginVertical: 8,
    },
    touchableOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },

    flatListContent: {
        paddingTop: 6,
    },
    noAddressesText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#64748b',
        marginTop: 12,
    },

    addressOption: {
        flex: 1,
        marginRight: 10,
    },

});