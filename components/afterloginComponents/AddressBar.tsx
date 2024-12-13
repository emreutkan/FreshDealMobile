// components/LoginScreenComponents/AddressBar.tsx
import React, {useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {scaleFont} from '@/components/utils/ResponsiveFont';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router'; // Corrected to useRouter hook
import LoginButton from '@/components/LoginScreenComponents/loginButton';

interface Address {
    id: string;
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
}

const AddressBar: React.FC = () => {
    const addresses = useSelector((state: RootState) => state.user.addresses) as Address[];
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses[0] || null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [textWidth, setTextWidth] = useState<number>(0);
    const router = useRouter();

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
        setModalVisible(false);
    };

    const renderAddressContent = () => {
        if (!selectedAddress) return 'No address selected';
        if (textWidth <= scaleFont(100)) {
            return selectedAddress.street;
        } else if (textWidth <= scaleFont(200)) {
            return `${selectedAddress.street}`;
        } else {
            return `${selectedAddress.street}, ${selectedAddress.district}`;
        }
    };

    const switchToAddAddress = () => {
        router.push("../addressScreen/addressSelectionScreen");
    };

    const handleAddNewAddress = () => {
        setModalVisible(false);
        switchToAddAddress();
    };

    const renderAddressItem = ({item}: { item: Address }) => (
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
    );

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.addressBar,
                    {minWidth: textWidth + scaleFont(40)}
                ]}
            >
                <Ionicons name="location-sharp" size={scaleFont(20)} color="#666" style={styles.icon}/>
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
                        onPressOut={() => setModalVisible(false)}
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
                                <Text style={styles.noAddressesText}>No addresses available.</Text>
                            )}
                            <TouchableOpacity
                                onPress={handleAddNewAddress}
                                style={styles.addAddressButton}
                                accessibilityLabel="Add New Address"
                                accessibilityHint="Navigate to add a new address screen"
                            >
                                <Ionicons name="add-circle-outline" size={scaleFont(20)} color="#007AFF"/>
                                <Text style={styles.addAddressText}>Add New Address</Text>
                            </TouchableOpacity>
                            <LoginButton
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

const styles = StyleSheet.create({
    container: {
        padding: scaleFont(10),
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
    addressOption: {
        paddingVertical: scaleFont(12),
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    addressOptionText: {
        fontSize: scaleFont(16),
        color: '#444',
    },
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
    noAddressesText: {
        fontSize: scaleFont(16),
        color: '#666',
        textAlign: 'center',
        marginVertical: scaleFont(10),
    },
});

export default AddressBar;
