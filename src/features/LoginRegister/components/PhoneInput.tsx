// PhoneInput.tsx
import React, {useState} from 'react';
import {Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {countryCodes} from '@/src/utils/countryCodes';
import {useDispatch, useSelector} from 'react-redux';
import {setPhoneNumber, setSelectedCode} from '@/src/redux/slices/userSlice';
import {RootState} from "@/src/types/store";
import BaseInput from './BaseInput';
import {scaleFont} from "@/src/utils/ResponsiveFont";

const PhoneInput: React.FC = () => {
    const dispatch = useDispatch();
    const phoneNumber = useSelector((state: RootState) => state.user.phoneNumber);
    const selectedCode = useSelector((state: RootState) => state.user.selectedCode);

    const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
    const [tempCode, setTempCode] = useState<string>(selectedCode);

    const handleChangeText = (text: string) => {
        const cleanedText = text.replace(/[^0-9]/g, '');
        if (cleanedText.length <= 15) {
            dispatch(setPhoneNumber(cleanedText));
        }
    };

    const handleConfirmSelection = () => {
        dispatch(setSelectedCode(tempCode));
        setIsPickerVisible(false);
    };

    // Custom component for the left icon (country code selector)
    const CountryCodeSelector = () => (
        <TouchableOpacity
            onPress={() => setIsPickerVisible(true)}
            style={styles.countryCodeContainer}
        >
            <Text style={styles.countryCodeText}>{selectedCode}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <BaseInput
                value={phoneNumber}
                onChangeText={handleChangeText}
                placeholder="Phone number"
                keyboardType="phone-pad"
                leftIcon={<CountryCodeSelector/>}
            />

            <Modal
                visible={isPickerVisible}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Picker
                            selectedValue={tempCode}
                            onValueChange={(itemValue) => setTempCode(itemValue)}
                            style={styles.picker}
                            itemStyle={{color: '#000', fontSize: 18}}
                        >
                            {countryCodes.map((item) => (
                                <Picker.Item
                                    key={item.code}
                                    label={`${item.country} (${item.code})`}
                                    value={item.code}
                                    color="#000"
                                />
                            ))}
                        </Picker>

                        <TouchableOpacity
                            onPress={handleConfirmSelection}
                            style={styles.confirmButton}
                        >
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setIsPickerVisible(false)}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    countryCodeContainer: {
        paddingVertical: scaleFont(8),
        paddingHorizontal: scaleFont(4),
    },
    countryCodeText: {
        fontSize: scaleFont(16),
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: Dimensions.get('window').width * 0.85,
        backgroundColor: '#fff',
        borderRadius: scaleFont(16),
        paddingVertical: scaleFont(20),
        paddingHorizontal: scaleFont(15),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    picker: {
        width: '100%',
        height: scaleFont(180),
        backgroundColor: '#F9F9F9',
        marginVertical: scaleFont(10),
    },
    confirmButton: {
        marginTop: scaleFont(10),
        backgroundColor: '#50703C',
        paddingVertical: scaleFont(12),
        paddingHorizontal: scaleFont(20),
        borderRadius: scaleFont(8),
        width: '100%',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: scaleFont(18),
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    cancelButton: {
        marginTop: scaleFont(10),
        paddingVertical: scaleFont(12),
        paddingHorizontal: scaleFont(20),
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderRadius: scaleFont(8),
    },
    cancelButtonText: {
        color: '#333',
        fontSize: scaleFont(18),
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
});

export default PhoneInput;