import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/utils/navigation';
import {AppDispatch, RootState} from '@/src/redux/store';
import {updateAddress} from "@/src/redux/thunks/addressThunks";
import {scaleFont} from '@/src/utils/ResponsiveFont';

const UpdateAddress: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch here

    const {addressId} = route.params as { addressId: string };
    const address = useSelector((state: RootState) =>
        state.address.addresses.find((addr) => addr.id === addressId)
    );

    const [street, setStreet] = useState(address?.street || '');
    const [district, setDistrict] = useState(address?.district || '');
    const [province, setProvince] = useState(address?.province || '');

    const handleUpdate = async () => {
        if (!street || !district || !province) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            await dispatch(
                updateAddress({
                    id: addressId,
                    updates: {street, district, province},
                })
            ).unwrap(); // Unwrap properly handles the AsyncThunk return value
            Alert.alert('Success', 'Address updated successfully');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to update address');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Address</Text>

            <TextInput
                style={styles.input}
                placeholder="Street"
                value={street}
                onChangeText={setStreet}
            />
            <TextInput
                style={styles.input}
                placeholder="District"
                value={district}
                onChangeText={setDistrict}
            />
            <TextInput
                style={styles.input}
                placeholder="Province"
                value={province}
                onChangeText={setProvince}
            />

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scaleFont(20),
        backgroundColor: '#fff',
    },
    title: {
        fontSize: scaleFont(20),
        fontWeight: '600',
        marginBottom: scaleFont(15),
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: scaleFont(8),
        padding: scaleFont(10),
        fontSize: scaleFont(16),
        marginBottom: scaleFont(15),
        backgroundColor: '#f9f9f9',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: scaleFont(12),
        borderRadius: scaleFont(8),
        marginHorizontal: scaleFont(5),
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: scaleFont(16),
        fontWeight: '600',
    },
});

export default UpdateAddress;
