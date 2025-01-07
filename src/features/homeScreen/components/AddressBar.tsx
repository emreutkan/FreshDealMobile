// components/LoginScreenComponents/AddressBar.tsx

import React, {useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppDispatch, RootState} from '@/store/store';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import DefaultButton from '@/src/features/DefaultButton';
import {Address, removeAddress} from '@/store/slices/addressSlice';
import {setPrimaryAddress} from "@/store/thunks/addressThunks";
import {RootStackParamList} from '@/src/types/navigation';

const AddressBar: React.FC = () => {
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

    const renderAddressContent = () => {
        let selectedAddress = addresses.find((addr) => addr.id === selectedAddressID);
        if (!selectedAddress) return 'Select an address';

        if (textWidth <= scaleFont(100)) {
            return selectedAddress.street;
        } else if (textWidth <= scaleFont(200)) {
            return `${selectedAddress.street}`;
        } else {
            return `${selectedAddress.street}, ${selectedAddress.district}`;
        }
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
                        {item.is_primary ? ' (Primary)' : ''}
                    </Text>
                </TouchableOpacity>

                <View style={styles.actionIcons}>
                    <TouchableOpacity
                        onPress={() => handleConfigureAddress(item.id)}
                        style={styles.configureIconContainer}
                        accessibilityLabel={`Configure address at ${item.street}`}
                    >
                        <Ionicons
                            name="create-outline"
                            size={scaleFont(20)}
                            color="#007AFF"
                        />
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

    return (
        <View style={styles.container}>

            <View
                style={[
                    styles.addressBar,
                    {minWidth: textWidth + scaleFont(40)},
                ]}
            >
                <Ionicons
                    name="location-sharp"
                    size={scaleFont(20)}
                    color="#666"
                    style={styles.icon}
                />
                <Text
                    style={styles.addressText}
                    onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {renderAddressContent()}
                </Text>


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
                        onPressOut={() => setModalVisible(true)
                        }
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Select Address</Text>
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
                                accessibilityHint="Navigate to add a new address screen"
                            >
                                <Ionicons
                                    name="add-circle-outline"
                                    size={scaleFont(20)}
                                    color="#007AFF"
                                />
                                <Text style={styles.addAddressText}>Add New Address</Text>
                            </TouchableOpacity>


                            <DefaultButton
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                                title="Close"
                            />
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
        backgroundColor: '#f9f9f9',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        maxHeight: scaleFont(60),
        minWidth: scaleFont(120),
    },
    icon: {
        marginRight: scaleFont(8),
    },
    addressText: {
        fontSize: scaleFont(16),
        color: '#333',
        flexShrink: 1,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: scaleFont(10),
        padding: scaleFont(20),
    },
    modalTitle: {
        fontSize: scaleFont(20),
        fontWeight: '600',
        marginBottom: scaleFont(15),
        textAlign: 'center',
        color: '#333',
    },
    flatListContent: {
        paddingBottom: scaleFont(10),
    },
    noAddressesText: {
        fontSize: scaleFont(16),
        color: '#666',
        textAlign: 'center',
        marginVertical: scaleFont(10),
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
        fontSize: scaleFont(16),
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

    // Button to add a new address at the bottom
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleFont(12),
        marginTop: scaleFont(15),
        justifyContent: 'center',
    },
    addAddressText: {
        fontSize: scaleFont(16),
        color: '#007AFF',
        marginLeft: scaleFont(8),
    },

    closeButton: {
        marginTop: scaleFont(20),
        alignItems: 'center',
        paddingVertical: scaleFont(10),
        backgroundColor: '#f0f0f0',
        borderRadius: scaleFont(5),
    },
});
