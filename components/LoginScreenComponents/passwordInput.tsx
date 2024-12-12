import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import {useDispatch} from "react-redux"; // Import useDispatch
import {setPassword} from "@/store/userSlice"; // Redux action to set the password

const PasswordInput: React.FC<{ password: string }> = ({password}) => {
    const dispatch = useDispatch();

    const handlePasswordChange = (value: string) => {
        dispatch(setPassword(value)); // Update password directly in Redux
    };

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange} // Directly handle changes here
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
