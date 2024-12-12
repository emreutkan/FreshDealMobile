// screens/LoginPage.tsx

import React, {useState} from 'react';
import {Alert, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';
import {useRouter} from 'expo-router';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store'
import {scaleFont} from '@/components/utils/ResponsiveFont';
import LoginButton from '@/components/LoginScreenComponents/loginButton';
import AppleOTP from '@/components/LoginScreenComponents/AppleOTPLogin';
import EmailLoginField from '@/components/LoginScreenComponents/emailInput';
import PhoneInput from '@/components/LoginScreenComponents/PhoneInput';
import {
    EmailSignInButton,
    GoogleSignInButton,
    PhoneSignInButton,
} from '@/components/LoginScreenComponents/loginButtons';
import PasswordInput from "@/components/LoginScreenComponents/passwordInput";

const LoginPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    // Import all user fields from the userSlice
    const {
        phoneNumber,
        password,
        selectedCode,
        email,
        passwordLogin,
        verificationCode,
        step,
        login_type,
    } = useSelector((state: RootState) => state.user);

    const [phoneLogin, setPhoneLogin] = useState<boolean>(login_type == 'phone_number');

    // const handlePasswordChange = (value: string) => {
    //     dispatch(setPassword(value));
    // };

    const handleLoginButton = async (): Promise<void> => {
        if (phoneLogin) {
            if (!phoneNumber) {
                Alert.alert('Error', 'Phone number cannot be empty.');
                return;
            }

            if (!isValidPhone(phoneNumber)) {
                Alert.alert('Error', 'Please enter a valid phone number.');
                return;
            }

            if (!password) {
                Alert.alert('Error', 'Password cannot be empty.');
                return;
            }


        } else {
        }
    };

    const handleEmailSubmit = (): void => {
        Alert.alert('Info', 'Email login is not yet implemented.');
    };

    // Utility function to validate phone numbers
    const isValidPhone = (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10,15}$/; // Adjust the regex as per your requirements
        return phoneRegex.test(phone);
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.bottomContainer}>
                <Text style={styles.welcomeText}>Last Call,</Text>
                <Text style={styles.welcomeText2}>Tasty Deals Await!</Text>

                {phoneLogin ? <PhoneInput/> : <EmailLoginField/>}
                {phoneNumber && phoneLogin && (
                    <PasswordInput password={password}/>
                )}
                {email && !phoneLogin && (
                    <PasswordInput password={password}/>

                )}
                <View style={styles.buttonRow}>
                    <View style={styles.buttonContainer}>
                        <LoginButton
                            onPress={() => router.push('./RegisterPage')}
                            title={'Sign in'}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <LoginButton onPress={handleLoginButton}/>
                    </View>
                </View>


                <View style={styles.registerContainer}>
                    <View style={styles.line}/>
                    <Text style={styles.orText}>or with</Text>
                    <View style={styles.line}/>
                </View>

                <AppleOTP/>
                <GoogleSignInButton/>

                {phoneLogin ? (
                    <TouchableOpacity onPress={() => setPhoneLogin(false)}>
                        <EmailSignInButton/>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setPhoneLogin(true)}>
                        <PhoneSignInButton/>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    bottomContainer: {
        borderWidth: 11,

        flex: 1,
        paddingHorizontal: scaleFont(35),
        justifyContent: 'flex-start',
        backgroundColor: '#f5f5f5', // Optional: Add background color for better UI
    },
    welcomeText: {
        fontSize: scaleFont(35),
        textAlign: 'center',
        color: '#000000',
        marginTop: scaleFont(20),
        // marginBottom: scaleFont(5),
    },
    welcomeText2: {
        fontSize: scaleFont(35),
        textAlign: 'center',
        marginBottom: scaleFont(20),
        color: '#50703C',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: scaleFont(10),
        marginBottom: scaleFont(0),
        justifyContent: 'space-between',
    },
    buttonContainer: {
        flex: 0.5,
        marginHorizontal: scaleFont(5),
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: scaleFont(20),
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: scaleFont(10),
        fontSize: scaleFont(16),
        color: '#666',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: scaleFont(10),
    },
    passwordInput: {
        // This style is now in the PasswordInput component
    },
});

export default LoginPage;