// components/LoginScreenComponents/PhoneInput.tsx

import React, {useState} from 'react';
import {Dimensions, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {countryCodes} from '@/components/constants/countryCodes';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import {useDispatch, useSelector} from 'react-redux';
import {setPhoneNumber, setSelectedCode} from '../../store/userSlice'; // Adjust the path as needed
import {RootState} from '../../store/store'; // Adjust the path as needed

const PhoneInput: React.FC = () => {
    const dispatch = useDispatch();

    // Access phoneNumber and selectedCode from Redux store
    const phoneNumber = useSelector((state: RootState) => state.user.phoneNumber);
    const selectedCode = useSelector((state: RootState) => state.user.selectedCode);

    // Local state for temporary country code selection and picker visibility
    const [tempCode, setTempCode] = useState<string>(selectedCode);
    const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(phoneNumber.length > 0);

    // Handle changes in phone number input
    const handleChangeText = (text: string) => {
        const cleanedText = text.replace(/[^0-9]/g, '');
        if (cleanedText.length <= 15) { // Enforce maximum of 15 characters
            dispatch(setPhoneNumber(cleanedText));
            setIsTyping(cleanedText.length > 0);
        }
    };

    // Handle clearing of phone number input
    const handleClearText = () => {
        dispatch(setPhoneNumber(''));
        setIsTyping(false);
    };

    // Handle confirmation of country code selection
    const handleConfirmSelection = () => {
        dispatch(setSelectedCode(tempCode));
        setIsPickerVisible(false);
    };

    // Render the country code selector button
    const renderCountryCodeSelector = () => (
        <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.countryCodeContainer}>
            <Text style={styles.countryCodeText}>{selectedCode}</Text>
        </TouchableOpacity>
    );

    // Render the country code picker inside a modal
    const renderPicker = () => (
        <Picker
            selectedValue={tempCode}
            onValueChange={(itemValue) => setTempCode(itemValue)}
            style={styles.picker}
        >
            {countryCodes.map((item) => (
                <Picker.Item key={item.code} label={`${item.country} (${item.code})`} value={item.code}/>
            ))}
        </Picker>
    );

    return (
        <View style={[
            styles.inputContainer,
            isTyping && {borderColor: 'gray'} // Change border color when typing
        ]}>
            {renderCountryCodeSelector()}
            <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                onChangeText={handleChangeText}
                value={phoneNumber}
                keyboardType="phone-pad"
                maxLength={15} // Enforce maximum of 15 characters
            />
            {isTyping && (
                <TouchableOpacity onPress={handleClearText} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
            )}

            {/* Country Code Picker Modal */}
            {isPickerVisible && (
                <Modal visible={isPickerVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            {renderPicker()}
                            <TouchableOpacity onPress={handleConfirmSelection} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: Dimensions.get('window').width * 0.8,
        backgroundColor: '#fff',
        borderRadius: scaleFont(16),
        padding: scaleFont(20),
        alignItems: 'center',
    },
    picker: {
        width: '100%',
    },
    confirmButton: {
        marginTop: scaleFont(10),
        backgroundColor: '#007AFF',
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(20),
        borderRadius: scaleFont(5),
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: scaleFont(16),
    },
    cancelButton: {
        marginTop: scaleFont(10),
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(20),
    },
    cancelButtonText: {
        color: '#FF0000',
        fontSize: scaleFont(16),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: scaleFont(16),
        paddingHorizontal: scaleFont(15),
        backgroundColor: '#fff',
        width: '100%',
        height: scaleFont(50),
    },
    countryCodeContainer: {
        paddingRight: scaleFont(10),
        paddingVertical: scaleFont(10),
        backgroundColor: 'transparent',
    },
    countryCodeText: {
        fontSize: scaleFont(16),
        color: '#333',
    },
    phoneInput: {
        flex: 1,
        fontSize: scaleFont(16),
        color: '#333',
        textAlignVertical: 'center',
        fontFamily: Platform.OS === 'android' ? 'Poppins' : 'Poppins-Regular',
        paddingVertical: scaleFont(10),
    },
    clearButton: {
        paddingHorizontal: scaleFont(10),
        paddingVertical: scaleFont(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#999',
        fontSize: scaleFont(16),
    },
});

export default PhoneInput;
