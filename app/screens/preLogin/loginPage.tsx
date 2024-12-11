// screens/LoginPage.tsx

import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {useRouter} from 'expo-router';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/store/store'
import {loginUser} from '@/store/userSlice';
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
    const dispatch = useDispatch<AppDispatch>();
    const {
        phoneNumber,
        selectedCode,
        email,
        name,
        surname,
        cart,
        addresses,
        currentAddress,
        loading,
        error,
    } = useSelector((state: RootState) => state.user);

    const [phoneLogin, setPhoneLogin] = useState<boolean>(true);
    const [password, setPassword] = useState<string>(''); // Local state for password
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

            const loginData = {
                phoneNumber,
                selectedCode,
                password,
            };

            try {
                const resultAction = await dispatch(loginUser(loginData));
                if (loginUser.fulfilled.match(resultAction)) {
                    Alert.alert('Success', 'Login successful!');
                    router.push('../screensAfterLogin/afterlogin');
                } else {
                    Alert.alert('Error', resultAction.payload as string);
                }
            } catch (err) {
                console.error('Login Error:', err);
                Alert.alert('Error', 'An unexpected error occurred.');
            }
        } else {
            handleEmailSubmit();
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
                    <PasswordInput password={password} setPassword={setPassword}/>
                )}
                {email && !phoneLogin && (
                    <PasswordInput password={password} setPassword={setPassword}/>
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

                {loading && <ActivityIndicator size="large" color="#0000ff"/>}
                {error && <Text style={styles.errorText}>{error}</Text>}

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
        flex: 1,
        paddingHorizontal: scaleFont(35),
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // Optional: Add background color for better UI
    },
    welcomeText: {
        fontSize: scaleFont(35),
        textAlign: 'center',
        color: '#000000',
        marginTop: scaleFont(20),
        marginBottom: scaleFont(5),
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