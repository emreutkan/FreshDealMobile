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
    textColor?: Animated.AnimatedInterpolation<number | string> | string
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
        let selectedAddress = addresses.find((addr) => addr.id === selectedAddressID?.toString());
        if (!selectedAddress) return 'Select an address';
        return `${selectedAddress.street}`;
    };

    const renderAddressDistrict = () => {
        let selectedAddress = addresses.find((addr) => addr.id === selectedAddressID?.toString());
        if (!selectedAddress) return 'Select an address';
        return `${selectedAddress.district}`;
    };

    const renderAddressItem = ({item}: { item: Address }) => {
        const isSelected = item.id === selectedAddressID?.toString();

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
                    <View style={styles.addressIconRow}>
                        <MaterialIcons
                            name={isSelected ? "location-on" : "location-on-outline"}
                            size={20}
                            color="#50703C"
                            style={{marginRight: 8}}
                        />
                        <Text style={[
                            styles.addressOptionText,
                            isSelected && styles.selectedAddressText
                        ]}>
                            {`${item.street}, ${item.district}, ${item.province}`}
                        </Text>
                    </View>

                    {isSelected && (
                        <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>Current</Text>
                        </View>
                    )}
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

    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={[styles.addressBar, {minWidth: textWidth + 160}]}>
                <MaterialIcons name="gps-fixed" size={18} color="#50703C"/>
                <Text
                    style={{
                        fontFamily: "Poppins-Medium",
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
                    color="#50703C"
                />

                <TouchableOpacity
                    onPress={handlePresentModal}
                    style={styles.touchableOverlay}
                    activeOpacity={1}
                    accessibilityLabel="Open Address Selector"
                    accessibilityHint="Opens a modal to select or add a new address"
                    testID="address-bar-button"
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
                        <Text style={styles.modalTitle}>Select Delivery Address</Text>
                    </View>

                    {addresses.length > 0 ? (
                        <FlatList
                            data={addresses}
                            keyExtractor={(item) => item.id}
                            renderItem={renderAddressItem}
                            contentContainerStyle={styles.flatListContent}
                        />
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <MaterialIcons name="location-off" size={48} color="#CBD5E0"/>
                            <Text style={styles.noAddressesText}>
                                No addresses available
                            </Text>
                            <Text style={styles.noAddressesSubtext}>
                                Add an address to continue with your order
                            </Text>
                        </View>
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

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    bottomSheetBackground: {
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 5,
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
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        textAlign: 'center',
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
    },
    selectedAddressItem: {
        backgroundColor: '#F0F9EB',
        borderColor: '#50703C',
        borderWidth: 1,
    },
    addressIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressOptionText: {
        fontFamily: "Poppins-Regular",
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    selectedAddressText: {
        fontFamily: "Poppins-Medium",
        color: '#000',
    },
    selectedBadge: {
        backgroundColor: '#50703C',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    selectedBadgeText: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        color: '#FFFFFF',
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
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
        marginTop: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    addAddressText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
        color: '#FFFFFF',
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
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        maxHeight: 60,
        minWidth: 120,
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
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    noAddressesText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: '#4A5568',
        marginTop: 16,
        textAlign: 'center',
    },
    noAddressesSubtext: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#718096',
        marginTop: 8,
        textAlign: 'center',
    },
    addressOption: {
        flex: 1,
        marginRight: 10,
    },
});

export default AddressBar;

