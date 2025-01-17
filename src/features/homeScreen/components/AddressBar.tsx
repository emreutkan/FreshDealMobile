// components/LoginScreenComponents/AddressBar.tsx

import React, {useState} from 'react';
import {Animated, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";

import {scaleFont} from '@/src/utils/ResponsiveFont';
import {removeAddress} from '@/src/redux/slices/addressSlice';
import {setPrimaryAddress} from "@/src/redux/thunks/addressThunks";
import {RootStackParamList} from '@/src/utils/navigation';
import {Address} from "@/src/types/api/address/model"
import {useSafeAreaInsets} from "react-native-safe-area-context";

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


    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [textWidth, setTextWidth] = useState<number>(0);

    // ===== Handlers =====
    const handleAddressSelect = async (address: Address) => {
        try {
            await dispatch(setPrimaryAddress(address.id)).unwrap();
            console.log('Primary address set:', address);
            setModalVisible(false);
        } catch (error) {
            console.error('Failed to set primary address:', error);
        }
    };


    const handleRemoveAddress = (addressId: string) => {
        dispatch(removeAddress(addressId));
    };

    const handleConfigureAddress = (addressId: string) => {
        setModalVisible(false);
        navigation.navigate('UpdateAddress', {addressId});
    };

    const handleAddNewAddress = () => {
        setModalVisible(false);
        navigation.navigate('AddressSelectionScreen');
    };

    // const renderAddressContent = () => {
    //     let selectedAddress = addresses.find((addr) => addr.id === selectedAddressID);
    //     if (!selectedAddress) return 'Select an address';
    //
    //     if (textWidth <= scaleFont(100)) {
    //         // return selectedAddress.street;
    //     } else if (textWidth <= scaleFont(200)) {
    //         return `${selectedAddress.street}`;
    //     } else {
    //         return `${selectedAddress.street}, ${selectedAddress.district}`;
    //     }
    // };

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
                        {item.is_primary ? (
                                <Ionicons name="chevron-forward-outline" size={20} color="#FF0000"/>

                            ) :

                            ''}
                        {`${item.street}, ${item.district}, ${item.province}`}

                    </Text>
                </TouchableOpacity>

                <View style={styles.actionIcons}>
                    <TouchableOpacity
                        onPress={() => handleConfigureAddress(item.id)}
                        style={styles.configureIconContainer}
                        accessibilityLabel={`Configure address at ${item.street}`}
                    >
                        <Ionicons name="create-outline" size={20} color="#FF0000"/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleRemoveAddress(item.id)}
                        style={styles.trashIconContainer}
                        accessibilityLabel={`Remove address at ${item.street}`}
                        accessibilityHint="Removes this address from the list"
                    >
                        <Ionicons name="trash" size={scaleFont(20)} color="#FF0000"/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const insets = useSafeAreaInsets()
    return (
        <View style={styles.container}>

            <View
                style={[
                    styles.addressBar,
                    {minWidth: textWidth + 160},
                ]}
            >
                <MaterialIcons name="gps-fixed" size={18} color="#4CAF50BE" style={
                    {
                        // marginRight: 8,
                    }
                }/>
                <Text
                    style={{
                        fontFamily: "Poppins-Regular",
                        // fontWeight: '900',
                        fontSize: 16,
                        color: '#333',
                        flexShrink: 1,
                        paddingLeft: 5,
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
                        paddingLeft: 5,
                        fontSize: 16,
                        color: 'rgba(51,51,51,0.64)',
                        flexShrink: 1,
                    }}
                    onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >

                    {renderAddressDistrict()}

                </Text>
                <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    style={{
                        marginLeft: 5,
                    }}
                    color="#88888867"
                />


                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.touchableOverlay}
                    activeOpacity={1}
                    accessibilityLabel="Open Address Selector"
                    accessibilityHint="Opens a modal to select or add a new address"
                />
            </View>


            {modalVisible && (
                <Modal
                    transparent
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <Ionicons
                                name="chevron-down-outline"
                                size={20}
                                style={{
                                    alignSelf: 'center',
                                }}
                                color="#1C1B1BFF"
                            />
                            {/* Here's where modalHeader is used */}
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
                                    size={scaleFont(20)}
                                    color="#ffffff"
                                />
                                <Text style={styles.addAddressText}>Add New Address</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

export default AddressBar;

// ===== Styles =====
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scaleFont(10),
    },
    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(15),
        borderRadius: scaleFont(20),

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        maxHeight: scaleFont(60),
        minWidth: scaleFont(120),
    },
    icon: {
        marginRight: 8,
    },

    touchableOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Makes modal slide up from bottom
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        paddingVertical: scaleFont(20),
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        // marginBottom: 8,
        top: 0,
        bottom: 20,
        position: 'absolute',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#1e293b',
        textAlign: 'center',
    },
    flatListContent: {
        paddingTop: 12,
        paddingBottom: 20,
    },
    separator: {
        height: 12,
    },
    noAddressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    noAddressesText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#64748b',
        marginTop: 12,
    },
    noAddressesSubText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        marginHorizontal: 16,
    },
    addAddressText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 8,
    },
    // Each row showing an address
    addressItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: scaleFont(12),
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedAddressItem: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: scaleFont(5),
        marginBottom: scaleFont(5),
    },
    addressOption: {
        flex: 1,
        marginRight: scaleFont(10),
    },
    addressOptionText: {
        fontFamily: "Poppins-Regular",
        alignSelf: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        color: '#444',
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    configureIconContainer: {
        paddingHorizontal: scaleFont(5),
        marginRight: scaleFont(10),
    },
    trashIconContainer: {
        paddingHorizontal: scaleFont(5),
        paddingVertical: scaleFont(5),
    },


    closeButton: {
        marginTop: scaleFont(20),
        alignItems: 'center',
        paddingVertical: scaleFont(10),
        backgroundColor: '#f0f0f0',
        borderRadius: scaleFont(5),
    },
});
