import React from 'react';
import {Alert, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState, store} from '@/store/store';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import DefaultButton from '@/src/features/DefaultButton';
import AppleOTP from '@/src/features/LoginRegister/components/AppleOTPLogin';
import EmailLoginField from '@/src/features/LoginRegister/components/EmailInput';
import PhoneInput from '@/src/features/LoginRegister/components/PhoneInput';
import {
    EmailSignInButton,
    GoogleSignInButton,
    PhoneSignInButton,
} from '@/src/features/LoginRegister/components/LoginRegisterScreenButtons';
import PasswordInput from '@/src/features/LoginRegister/components/PasswordInput';
import {setLoginType, setPasswordLogin, setToken} from '@/store/slices/userSlice';
import {getUserData, loginUser} from '@/store/thunks/userThunks';

interface LoginModalProps {
    switchToRegister: () => void; // Callback to switch to RegisterModal
}

const LoginModal: React.FC<LoginModalProps> = ({switchToRegister}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {loading, token} = useSelector((state: RootState) => state.user);

    // Import all user fields from the userSlice
    const {
        phoneNumber,
        password,
        email,
        passwordLogin,
        login_type,
        selectedCode,
    } = useSelector((state: RootState) => state.user);

    React.useEffect(() => {
        if (passwordLogin) {
            handleLoginButton();
        }
    }, [passwordLogin]);

    /**
     * Handles the login button click.
     * Performs validation checks and dispatches the login request.
     * Resets `passwordLogin` state to `false` after the login attempt.
     */
    const handleLoginButton = async () => {
        console.log('login button pressed');
        if (login_type === 'phone_number' && !phoneNumber) {
            Alert.alert('Error', 'Phone number is required.');
            return;
        }
        if (login_type === 'email' && !email) {
            Alert.alert('Error', 'Email is required.');
            return;
        }
        if (passwordLogin) {
            if (!password) {
                Alert.alert('Error', 'Password is required.');
                return;
            }
            try {
                console.log(selectedCode + phoneNumber);
                const result = await dispatch(
                    loginUser({
                        email: email,
                        phone_number: selectedCode + phoneNumber,
                        password: password,
                        login_type: login_type,
                        password_login: passwordLogin,
                    })
                ).unwrap();
                console.log('Login request successful', result);

                if (result.success) {
                    console.log(
                        'store.getState().user before setToken = ',
                        store.getState().user
                    );

                    dispatch(setToken(result.token));
                    dispatch(getUserData({token: result.token}));
                    console.log(
                        'store.getState().user = after setToken',
                        store.getState().user
                    );
                } else {
                    Alert.alert(
                        'Login Failed',
                        result.message || 'Something went wrong.'
                    );
                }
            } catch (error) {
                console.error('Login failed', error);
                Alert.alert('Error', 'Failed to login. Please try again.');
            }
        }

        dispatch(setPasswordLogin(false));
    };

    const handleLoginTypeChange = (type: 'email' | 'phone_number') => {
        dispatch(setLoginType(type));
    };

    React.useEffect(() => {
        console.log('Login type updated:', login_type);
    }, [login_type]);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.bottomContainer}>
                <Text style={styles.welcomeText}>Last Call,</Text>
                <Text style={styles.welcomeText2}>Tasty Deals Await!</Text>

                {/* Input Fields */}
                {login_type === 'phone_number' ? <PhoneInput/> : <EmailLoginField/>}

                {/* Password Field */}
                {(phoneNumber || email) && <PasswordInput password={password}/>}

                <View style={styles.buttonRow}>
                    {!phoneNumber && !email && (
                        <>
                            <View style={styles.buttonContainer}>
                                <DefaultButton
                                    onPress={switchToRegister} // Switch to RegisterModal
                                    title="Sign up"
                                />
                            </View>
                            {loading ? (
                                <View style={styles.loaderContainer}>
                                    <Text style={styles.loaderText}>Loading...</Text>
                                </View>
                            ) : token ? (
                                <Text style={styles.loggedInText}>
                                    Welcome, you are logged in!
                                </Text>
                            ) : (
                                <View style={styles.buttonContainer}>
                                    <DefaultButton onPress={handleLoginButton} title="Login"/>
                                </View>
                            )}
                        </>
                    )}

                    {(phoneNumber || email) && (
                        <View style={styles.loginContainer}>
                            <DefaultButton
                                onPress={() => {
                                    dispatch(setPasswordLogin(true));
                                }}
                                title="Login"
                            />
                            <TouchableOpacity
                                style={styles.passwordlessLoginContainer}
                                onPress={() => {
                                    dispatch(setPasswordLogin(false));
                                }}
                            >
                                <Text style={styles.passwordlessLoginText}>
                                    Passwordless Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.registerContainer}>
                    <View style={styles.line}/>
                    <Text style={styles.orText}>or with</Text>
                    <View style={styles.line}/>
                </View>

                <AppleOTP/>
                <GoogleSignInButton/>

                {login_type === 'phone_number' ? (
                    <TouchableOpacity onPress={() => handleLoginTypeChange('email')}>
                        <EmailSignInButton/>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => handleLoginTypeChange('phone_number')}
                    >
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
        justifyContent: 'flex-start',
        backgroundColor: '#f5f5f5',
    },
    welcomeText: {
        fontSize: scaleFont(35),
        textAlign: 'center',
        color: '#000000',
        marginTop: scaleFont(20),
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
        justifyContent: 'space-between',
    },
    buttonContainer: {
        flex: 0.5,
        marginHorizontal: scaleFont(5),
    },
    loginContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',

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
    signInWithoutPwd: {
        textAlign: 'center',
        color: '#50703C',
        fontSize: scaleFont(14),
        textDecorationLine: 'underline',
    },
    passwordlessLoginContainer: {
        marginTop: scaleFont(10),
        alignItems: 'center',
    },

    passwordlessLoginText: {
        fontSize: scaleFont(18),
        color: '#50703C',
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        fontSize: 16,
        color: '#999',
    },
    loggedInText: {
        fontSize: 18,
        color: '#000',
    },
});

export default LoginModal;