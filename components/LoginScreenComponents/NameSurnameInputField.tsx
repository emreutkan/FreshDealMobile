// components/LoginScreenComponents/NameSurnameInputField.tsx

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, TextInput, StyleSheet, View, Keyboard } from 'react-native';
import {scaleFont} from "@/utils/ResponsiveFont";
import {UserModel} from "@/models/UserModel";
import {validateName} from "@/components/utils/validationUtils";
const NameSurnameField = () => {
    const user = UserModel.getInstance();
    const [fullName, setFullName] = useState<string>(user.getFullName() || '');

    const handleTextChange = (text: string) => {
        // Remove any non-letter characters except for spaces
        const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
        setFullName(cleanedText);
        updateUserModel(cleanedText);
    };

    const updateUserModel = (name: string) => {
        const names = name.trim().split(/\s+/);
        const firstName = names.slice(0, -1).join(' ') || names[0] || '';
        const surname = names.length > 1 ? names[names.length - 1] : '';
        user.setName(firstName);
        user.setSurname(surname);
    };

    useEffect(() => {
        // Initialize UserModel with current fullName
        updateUserModel(fullName);
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.inputContainer} onPress={() => Keyboard.dismiss()}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={handleTextChange}
                    onFocus={() => console.log("Name Input Focused")}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
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
    input: {
        marginLeft: scaleFont(10),
        flex: 1,
        fontSize: scaleFont(17),
        color: '#1a1818',
        fontFamily: 'Poppins-Regular',
    },
});

export default NameSurnameField;
