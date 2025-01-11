import React, {useState} from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, store} from "@/store/store";
import {getUserData, loginUser, registerUser, verifyCode} from "@/store/thunks/userThunks";
import DefaultButton from "@/src/features/DefaultButton";
import NameSurnameInputField from "@/src/features/LoginRegister/components/NameSurnameInputField";
import PhoneInput from "@/src/features/LoginRegister/components/PhoneInput";
import EmailLoginField from "@/src/features/LoginRegister/components/EmailInput";
import PasswordInput from "@/src/features/LoginRegister/components/PasswordInput";
import VerificationCodeInputField from "@/src/features/LoginRegister/components/VerificationCodeInputField"; // Assume this component exists
import {setToken} from "@/store/slices/userSlice";
import {Ionicons} from "@expo/vector-icons"; // For navigation

interface RegisterModalProps {
    switchToLogin: () => void; // Callback to switch to LoginModal
}

const RegisterModal: React.FC<RegisterModalProps> = ({switchToLogin}) => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        password,
        name_surname,
        phoneNumber,
        email,
        loading,
        selectedCode,
        error,
    } = useSelector((state: RootState) => state.user);

    // Local state to track if verification code has been sent
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>(""); // To store user input for verification code

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
                registerUser({
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

                // Optionally, you can auto-login the user or perform other actions here
            } else {
                Alert.alert("Registration Failed", result.message || "Something went wrong.");
            }
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message || "An error occurred");
        }
    };

    const handleVerifyCode = async (): Promise<void> => {
        // Implement your verification logic here
        // For example, send the verificationCode to the backend to verify

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
                skipLoginUser()
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
                loginUser({
                    email: email,
                    phone_number: selectedCode + phoneNumber,
                    password: password,
                    login_type: "email",
                    password_login: true,
                })
            ).unwrap();

            if (loginResult.success) {
                console.log("store.getState().user before setToken = ", store.getState().user);

                dispatch(setToken(loginResult.token));
                dispatch(getUserData({token: loginResult.token}));
                console.log("store.getState().user = after setToken", store.getState().user);
            }
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message || "An error occurred");
        }

    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.scrollContainer}>

                    {!isCodeSent ? (
                        // Registration Input Fields
                        <>
                            <View style={styles.inputArea}>
                                <NameSurnameInputField/>
                            </View>
                            <View style={styles.inputArea}>
                                <PhoneInput/>
                            </View>
                            <View style={styles.inputArea}>
                                <EmailLoginField/>
                            </View>
                            <View style={styles.inputArea}>
                                <PasswordInput password={password}/>
                            </View>

                            <View style={styles.buttonArea}>
                 
                                <View style={styles.skipContainer}>
                                    <TouchableOpacity onPress={switchToLogin} style={styles.skipButton}>
                                        <Ionicons name="arrow-back-outline" size={20} color="#000"/>
                                        <Text style={styles.skipText}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.SignupButton}>
                                    <DefaultButton onPress={handleRegister} title="Sign up"/>
                                </View>
                            </View>
                        </>
                    ) : (
                        // Verification Code Input Field and Skip Button
                        <>
                            <View style={styles.inputArea}>
                                <VerificationCodeInputField
                                    value={verificationCode}
                                    onChangeText={setVerificationCode}
                                    placeholder="Enter 6-digit code"
                                    keyboardType="numeric"
                                />
                            </View>

                            <DefaultButton onPress={handleVerifyCode} title="Verify"/>

                            <View style={styles.skipContainer}>
                                <TouchableOpacity onPress={skipLoginUser} style={styles.skipButton}>
                                    <Ionicons name="arrow-forward-outline" size={20} color="#000"/>
                                    <Text style={styles.skipText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {loading && <ActivityIndicator size="large" color="#0000ff"/>}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "flex-start",
        paddingHorizontal: scaleFont(35),
        paddingTop: scaleFont(35),
    },
    inputArea: {
        marginBottom: scaleFont(15),
    },

    backButton: {
        flex: 1 / 4,
    },
    SignupButton: {
        flex: 3 / 4,
        marginLeft: scaleFont(10),
    },
    skipContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: scaleFont(15),
    },
    skipButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: scaleFont(5),
    },
    skipText: {
        fontSize: scaleFont(16),
        color: "#000",
        marginLeft: scaleFont(5),
    },

    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: scaleFont(10),
    },
    buttonArea: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: scaleFont(10),
    }
});

export default RegisterModal;
