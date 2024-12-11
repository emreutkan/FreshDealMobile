// components/LoginScreenComponents/PasswordInput.tsx

import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {scaleFont} from "@/components/utils/ResponsiveFont";

interface PasswordInputProps {
    password: string;
    setPassword: (password: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({password, setPassword}) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: scaleFont(10),
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: scaleFont(16),
        paddingHorizontal: scaleFont(15),
        backgroundColor: '#fff',
        width: '100%',
        height: scaleFont(50),
        justifyContent: 'center',
    },
    passwordInput: {
        fontSize: scaleFont(16),
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
});

export default PasswordInput;
