import React, {useCallback, useState} from 'react';
import {Alert, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";

import {scaleFont} from '@/src/utils/ResponsiveFont';
import AppleOTP from '@/src/features/LoginRegister/components/AppleOTPLogin';
import PhoneInput from '@/src/features/LoginRegister/components/PhoneInput';
import {setEmail, setLoginType, setPassword, setPasswordLogin} from '@/src/redux/slices/userSlice';
import {loginUserThunk} from '@/src/redux/thunks/userThunks';
import GoogleOTP from "@/src/features/LoginRegister/components/GoogleOTP";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import BaseInput from "@/src/features/LoginRegister/components/BaseInput";
import {CustomButton} from "@/src/features/LoginRegister/components/CustomButton";
import {forgotPassword} from "@/src/redux/api/authAPI";
import {ForgotPasswordModal} from "@/src/features/LoginRegister/components/ForgotPasswordModalContent";

interface LoginModalProps {
    switchToRegister: () => void; // Callback to switch to RegisterModal
}


const LoginModal: React.FC<LoginModalProps> = ({switchToRegister}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {loading} = useSelector((state: RootState) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);

    const handleForgotPasswordSubmit = useCallback(async (email: string) => {
        try {
            console.log(email, 'email', 'forgotPassword');
            dispatch(forgotPassword({email}));
            setIsForgotPasswordVisible(false);
            Alert.alert(
                'Success',
                'Password reset instructions have been sent to your email.',
                [{text: 'OK'}]
            );
        } catch (error) {
            throw error;
        }
    }, []);

    const toggleForgotPassword = useCallback(() => {
        setIsForgotPasswordVisible(prev => !prev);
    }, []);


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
                await dispatch(
                    loginUserThunk({
                        email: email,
                        phone_number: selectedCode + phoneNumber,
                        password: password,
                        login_type: login_type,
                        password_login: passwordLogin,
                    })
                ).unwrap();

            } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to login. Please try again.');
            }
        }

        dispatch(setPasswordLogin(false));
    };

    const handleLoginTypeChange = (type: 'email' | 'phone_number') => {
        dispatch(setLoginType(type));
    };


    return (
        <TouchableWithoutFeedback
            onPress={() => Keyboard.dismiss()}
        >
            <View style={styles.bottomContainer}>
                <Text style={styles.welcomeText}>Last Call,</Text>
                <Text style={styles.welcomeText2}>Tasty Deals Await!</Text>

                {login_type === 'phone_number' ?
                    <PhoneInput/> :
                    <BaseInput
                        value={email}
                        onChangeText={(text) => dispatch(setEmail(text))}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        leftIcon={<MaterialIcons name="email" size={24} color="#50703C"/>}
                    />}

                {(phoneNumber || email) &&
                    <BaseInput
                        value={password}
                        onChangeText={(text) => dispatch(setPassword(text))}
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        leftIcon={<MaterialIcons name="lock" size={24} color="#50703C"/>}
                        rightIcon={
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons
                                    name={showPassword ? "visibility" : "visibility-off"}
                                    size={24}
                                    color="#50703C"
                                />
                            </TouchableOpacity>
                        }
                    />


                }

                {(phoneNumber || email) && (
                    <TouchableOpacity
                        onPress={() => setIsForgotPasswordVisible(true)}
                        style={styles.forgotPasswordLink}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                )}

                <View>
                    {!phoneNumber && !email && (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <CustomButton onPress={switchToRegister} title="Sign up" loading={loading}
                                          variant={'green'} style={{
                                width: '48%',
                            }}/>
                            <CustomButton onPress={handleLoginButton} title="Login" loading={loading}
                                          variant={'green'}
                                          style={{
                                              width: '48%',
                                          }}/>
                        </View>
                    )}

                    {(phoneNumber || email) && (
                        <View style={styles.loginContainer}>


                            <CustomButton onPress={() => {
                                dispatch(setPasswordLogin(true));
                            }} title="Login" loading={loading}
                                          variant={'green'}/>


                            <CustomButton onPress={() => {
                                dispatch(setPasswordLogin(false));
                            }} title="Passwordless Login" loading={loading} variant={'green'}/>
                        </View>
                    )}
                </View>

                <View style={styles.registerContainer}>
                    <View style={styles.line}/>
                    <Text style={styles.orText}>or with</Text>
                    <View style={styles.line}/>
                </View>

                <AppleOTP useCustomButton={true}/>
                <GoogleOTP/>

                {login_type === 'phone_number' ? (


                    <CustomButton onPress={() => handleLoginTypeChange('email')} title="Sign in with Email"
                                  loading={loading}
                                  variant={'default'}
                                  icon={<Ionicons name="mail-outline" size={20} color="#000"
                                                  style={{right: 4}}/>}/>


                ) : (


                    <CustomButton onPress={() => handleLoginTypeChange('phone_number')} title="Sign in with Phone"
                                  loading={loading}
                                  variant={'default'}
                                  icon={<Ionicons name="call-outline" size={20} color="#000" style={{}}/>}/>

                )}
                <ForgotPasswordModal
                    isVisible={isForgotPasswordVisible}
                    onClose={toggleForgotPassword}
                    onSubmit={handleForgotPasswordSubmit}
                />
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


    loginContainer: {
        // flex: 1,
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
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginTop: 8,
        marginBottom: 16,
    },
    forgotPasswordText: {
        color: '#50703C',
        fontSize: scaleFont(14),
        textDecorationLine: 'underline',
    },

});

export default LoginModal;
