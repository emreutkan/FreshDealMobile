// screens/RegisterScreen.tsx

import React from "react";
import {ActivityIndicator, Alert, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View,} from "react-native";
import LoginButton from "../../../components/LoginScreenComponents/loginButton";
import {scaleFont} from "@/components/utils/ResponsiveFont";
import EmailLoginField from "@/components/LoginScreenComponents/emailInput";
import PhoneInput from "../../../components/LoginScreenComponents/PhoneInput";
import {useRouter} from 'expo-router';
import NameSurnameInputField from "../../../components/LoginScreenComponents/NameSurnameInputField";
import PasswordInput from "@/components/LoginScreenComponents/passwordInput"; // Import the new PasswordInput component
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const {
        password,
        name_surname,
        phoneNumber,
        selectedCode,
        email,
        loading,
        error,
    } = useSelector((state: RootState) => state.user);


    const handleRegister = async (): Promise<void> => {
        // Validate data before sending
        if (!name_surname || !phoneNumber || !email || !password) {
            Alert.alert('Error', 'Please fill in all the required fields.');
            return;
        }

        // Additional validations (optional)
        if (!isValidPhone(phoneNumber)) {
            Alert.alert('Error', 'Please enter a valid phone number.');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }


    };

    // Utility function to validate phone numbers
    const isValidPhone = (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10,15}$/; // Adjust the regex as per your requirements
        return phoneRegex.test(phone);
    };

    // Utility function to validate email addresses
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Determine whether to show PasswordInput
    const showPasswordInput = email.length > 0 || phoneNumber.length > 0;

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <View style={styles.inputArea}>
                    <NameSurnameInputField/>
                </View>
                <View style={styles.inputArea}>
                    <PhoneInput/>
                </View>
                <View style={styles.inputArea}>
                    <EmailLoginField/>
                </View>
                {showPasswordInput && (
                    <View style={styles.inputArea}>
                        <PasswordInput password={password}/>

                    </View>
                )}

                <View style={styles.buttonArea}>
                    <View style={styles.backButton}>
                        <LoginButton
                            onPress={() => router.back()}
                            title='<'
                        />
                    </View>
                    <View style={styles.SignupButton}>
                        <LoginButton
                            onPress={handleRegister}
                            title='Sign up'
                        />
                    </View>
                </View>

                {loading && <ActivityIndicator size="large" color="#0000ff"/>}
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: scaleFont(35),
        paddingHorizontal: scaleFont(35),
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // Optional: Add background color for better UI
    },
    inputArea: {
        marginBottom: scaleFont(15),
    },
    buttonArea: {
        marginTop: scaleFont(35),
        padding: scaleFont(0),
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    backButton: {
        flex: 1,
        marginBottom: scaleFont(10),
    },
    SignupButton: {
        flex: 4,
        marginLeft: scaleFont(10),
        marginBottom: scaleFont(10),
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: scaleFont(10),
    },
    // ... other styles ...
});

export default RegisterScreen;
