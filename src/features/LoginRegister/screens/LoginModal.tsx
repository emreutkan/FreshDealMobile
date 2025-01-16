import React from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/src/redux/store';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import AppleOTP from '@/src/features/LoginRegister/components/AppleOTPLogin';
import EmailLoginField from '@/src/features/LoginRegister/components/EmailInput';
import PhoneInput from '@/src/features/LoginRegister/components/PhoneInput';
import {GoogleSignInButton,} from '@/src/features/LoginRegister/components/GoogleSignInButton';
import PasswordInput from '@/src/features/LoginRegister/components/PasswordInput';
import {setLoginType, setPasswordLogin} from '@/src/redux/slices/userSlice';
import {loginUserThunk} from '@/src/redux/thunks/userThunks';
import {EmailSignInButton} from "@/src/features/LoginRegister/components/EmailSignInButton";
import {PhoneSignInButton} from "@/src/features/LoginRegister/components/PhoneSignInButton";
import {ButtonStyles} from "@/src/styles/ButtonStyles";

interface LoginModalProps {
    switchToRegister: () => void; // Callback to switch to RegisterModal
}

const LoginModal: React.FC<LoginModalProps> = ({switchToRegister}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {loading, token, error} = useSelector((state: RootState) => state.user);

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
            (async () => {
                await handleLoginButton();
            })();
        }
    }, [passwordLogin]);


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
                    loginUserThunk({
                        email: email,
                        phone_number: selectedCode + phoneNumber,
                        password: password,
                        login_type: login_type,
                        password_login: passwordLogin,
                    })
                ).unwrap();
                console.log('Login request successful', result);

            } catch (error: any) {
                console.error('Login failed', error);
                // Display the specific error message from the server
                Alert.alert('Error', error.message || 'Failed to login. Please try again.');
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

                {login_type === 'phone_number' ? <PhoneInput/> : <EmailLoginField/>}

                {(phoneNumber || email) &&
                    <View style={{marginTop: scaleFont(10)}}>
                        <PasswordInput password={password}/>


                    </View>

                }

                <View style={styles.buttonRow}>
                    {!phoneNumber && !email && (
                        <>
                            <View style={styles.buttonContainer}>

                                <TouchableOpacity
                                    style={ButtonStyles.defaultGreenButton}
                                    onPress={switchToRegister}
                                >
                                    <Text style={ButtonStyles.ButtonText}>
                                        Sign up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {loading ? (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="small" color="#50703C"/>
                                </View>
                            ) : token ? (
                                <Text style={styles.loggedInText}>
                                    Welcome, you are logged in!
                                </Text>
                            ) : (
                                <View style={styles.buttonContainer}>

                                    <TouchableOpacity
                                        style={ButtonStyles.defaultGreenButton}
                                        onPress={handleLoginButton}
                                    >
                                        <Text style={ButtonStyles.ButtonText}>
                                            Login
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}

                    {(phoneNumber || email) && (
                        <View style={styles.loginContainer}>

                            <TouchableOpacity
                                style={ButtonStyles.defaultGreenButton}
                                onPress={() => {
                                    dispatch(setPasswordLogin(true));
                                }}
                            >
                                <Text style={ButtonStyles.ButtonText}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.passwordlessLoginContainer}
                                onPress={() => {
                                    dispatch(setPasswordLogin(false));
                                }}
                            >
                                {login_type === 'email' &&
                                    <Text style={styles.passwordlessLoginText}>
                                        Passwordless Login
                                    </Text>
                                }

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
        // backgroundColor: '#f5f5f5',
    },
    welcomeText: {
        fontSize: scaleFont(32),
        textAlign: 'center',
        color: '#000000',
        marginTop: scaleFont(20),
    },
    welcomeText2: {
        fontSize: scaleFont(32),
        textAlign: 'center',
        marginBottom: scaleFont(20),
        color: '#50703C',
    },
    buttonRow: {
        flexDirection: 'row',
        // marginTop: scaleFont(10),
        justifyContent: 'space-between',
        paddingTop: scaleFont(14),

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
        marginTop: scaleFont(12),
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
        marginTop: scaleFont(14),
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
