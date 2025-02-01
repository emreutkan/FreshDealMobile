import React, {useState} from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, store} from "@/src/redux/store";
import {RootState} from "@/src/types/store";

import {getUserDataThunk, loginUserThunk, registerUserThunk,} from "@/src/redux/thunks/userThunks";
import PhoneInput from "@/src/features/LoginRegister/components/PhoneInput";
import VerificationCodeInputField from "@/src/features/LoginRegister/components/VerificationCodeInputField"; // Assume this component exists
import {setEmail, setName, setPassword, setToken} from "@/src/redux/slices/userSlice"; // Adjust the path as needed
import {MaterialIcons} from "@expo/vector-icons";
import {verifyCode} from "@/src/redux/api/authAPI";
import BaseInput from "@/src/features/LoginRegister/components/BaseInput";
import {CustomButton} from "@/src/features/LoginRegister/components/CustomButton";

interface RegisterModalProps {
    switchToLogin: () => void; // Callback to switch to LoginModal
}

const RegisterModal: React.FC<RegisterModalProps> = ({switchToLogin}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [showPassword, setShowPassword] = useState(false);

    const {
        password,
        name_surname,
        phoneNumber,
        email,
        loading,
        selectedCode,

    } = useSelector((state: RootState) => state.user);

    // Local state to track if verification code has been sent
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>(""); // To store user input for verification code
    const name = useSelector((state: RootState) => state.user.name_surname);

    // Display error alerts when 'error' state changes


    const validateInput = (): boolean => {
        if (!name_surname) {
            Alert.alert("Error", "Name and surname are required.");
            return false;
        }
        if (!email && !phoneNumber) {
            Alert.alert("Error", "Email or phone number is required.");
            return false;
        }
        if (!password) {
            Alert.alert("Error", "Password is required.");
            return false;
        }
        return true;
    };

    const handleRegister = async (): Promise<void> => {
        console.log("Register button pressed");
        if (!validateInput()) return;
        console.log("Input validated");
        try {
            const result = await dispatch(
                registerUserThunk({
                    name_surname,
                    email,
                    phone_number: selectedCode + phoneNumber,
                    password,
                    role: "customer",
                })
            ).unwrap();
            console.log("Result = ", result);
            if (result.message === "User registered successfully!") {
                // Set isCodeSent to true to show verification input
                setIsCodeSent(true);
                Alert.alert(
                    "Verification Code Sent",
                    "A verification code has been sent to your email."
                );

            } else {
                Alert.alert("Registration Failed", result.message || "Something went wrong.");
            }
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message || "An error occurred");
        }
    };

    const handleVerifyCode = async (): Promise<void> => {

        if (verificationCode.length !== 6) {
            Alert.alert("Error", "Please enter a 6-digit verification code.");
            return;
        }

        try {
            const verifyResult = await dispatch(
                // Assuming you have a verifyCode thunk
                verifyCode({verification_code: verificationCode, email})
            ).unwrap();

            if (verifyResult.success) {
                Alert.alert("Success", "Your email has been verified!");
                await skipLoginUser()
            } else {
                Alert.alert("Verification Failed", verifyResult.message || "Invalid code.");
            }
        } catch (error: any) {
            Alert.alert("Verification Failed", error.message || "An error occurred");
        }
    };

    const skipLoginUser = async (): Promise<void> => {
        try {
            const loginResult = await dispatch(
                loginUserThunk({
                    email: email,
                    phone_number: selectedCode + phoneNumber,
                    password: password,
                    login_type: "email",
                    password_login: true,
                })
            ).unwrap();

            if (loginResult) {
                console.log("store.getState().user before setToken = ", store.getState().user);

                dispatch(setToken(loginResult.token));
                dispatch(getUserDataThunk({token: loginResult.token}));
                console.log("store.getState().user = after setToken", store.getState().user);
            }
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message || "An error occurred");
        }

    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.scrollContainer}

                    >
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>
                                {!isCodeSent ? "Create Account" : "Verify Email"}
                            </Text>
                            <Text style={styles.subHeaderText}>
                                {!isCodeSent
                                    ? "Please fill in the details to get started"
                                    : "Enter the 6-digit code sent to your email"
                                }
                            </Text>
                        </View>

                        {!isCodeSent ? (
                            <View style={styles.formContainer}>
                                <BaseInput
                                    value={name}
                                    onChangeText={(text) => {
                                        const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                                        dispatch(setName(cleanedText));
                                    }}
                                    placeholder="Enter your name"
                                    autoCapitalize="words"
                                    leftIcon={<MaterialIcons name="person" size={24} color="#50703C"/>}
                                />
                                <PhoneInput/>
                                <BaseInput
                                    value={email}
                                    onChangeText={(text) => dispatch(setEmail(text))}
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    leftIcon={<MaterialIcons name="email" size={24} color="#50703C"/>}
                                />
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

                                <CustomButton onPress={handleRegister} title="Register"
                                              variant={'green'}
                                />

                                <View style={styles.switchContainer}>
                                    <Text style={styles.switchText}>
                                        Already have an account?
                                    </Text>
                                    <TouchableOpacity
                                        onPress={switchToLogin}
                                        style={styles.switchButton}
                                    >
                                        <Text style={styles.switchButtonText}>
                                            Log in
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.verificationContainer}>
                                <View style={styles.codeInputArea}>
                                    <VerificationCodeInputField
                                        value={verificationCode}
                                        onChangeText={setVerificationCode}
                                    />
                                </View>


                                <CustomButton onPress={handleVerifyCode} title={"Verify Email"} variant={'green'}/>

                                <TouchableOpacity
                                    onPress={skipLoginUser}
                                    style={styles.skipButton}
                                >
                                    <Text style={styles.skipText}>
                                        Skip Verification
                                    </Text>

                                </TouchableOpacity>
                            </View>
                        )}

                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007AFF"/>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 15,
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: "Poppins-Regular",
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    subHeaderText: {
        fontFamily: "Poppins-Regular",

        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
    },

    inputArea: {

        marginBottom: 12,
    },
    buttonContainer: {
        marginTop: 6,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    switchText: {
        fontFamily: "Poppins-Regular",

        fontSize: 16,
        color: '#666666',
    },
    switchButton: {
        marginLeft: 2,
        padding: 4,
    },
    switchButtonText: {
        fontFamily: "Poppins-Regular",

        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    verificationContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 32,
    },
    codeInputArea: {
        width: '100%',
        marginBottom: 16,
    },
    skipButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: scaleFont(16),


    },
    skipText: {
        fontSize: 16,
        color: '#007AFF',
        fontFamily: "Poppins-Regular",
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RegisterModal;