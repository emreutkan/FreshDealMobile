import React from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, store} from "@/store/store";
import {getUserData, loginUser, registerUser} from "@/store/thunks/userThunks";
import {setToken} from "@/store/slices/userSlice";
import DefaultButton from "@/src/features/DefaultButton";
import NameSurnameInputField from "@/src/features/LoginRegister/components/NameSurnameInputField";
import PhoneInput from "@/src/features/LoginRegister/components/PhoneInput";
import EmailLoginField from "@/src/features/LoginRegister/components/EmailInput";
import PasswordInput from "@/src/features/LoginRegister/components/PasswordInput";

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
        error,
        selectedCode,
    } = useSelector((state: RootState) => state.user);

    const SUCCESS_MESSAGE = "Registration completed!";

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
        console.log("register button pressed");
        if (!validateInput()) return;
        console.log("input validated");
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
            console.log("result = ", result);
            if (result.message === "User registered successfully!") {
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
                } else {
                    Alert.alert("Login Failed", loginResult.message || "Something went wrong.");
                }
            } else {
                Alert.alert("Registration Failed", result.message || "Something went wrong.");
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
                <View style={styles.scrollContainer}> {/* Wrap all children inside a single parent */}
                    <View style={styles.inputArea}>
                        <NameSurnameInputField/>
                    </View>
                    <View style={styles.inputArea}>
                        <PhoneInput/>
                    </View>
                    <View style={styles.inputArea}>
                        <EmailLoginField/>
                    </View>
                    {(email || phoneNumber) && (
                        <View style={styles.inputArea}>
                            <PasswordInput password={password}/>
                        </View>
                    )}

                    <View style={styles.buttonArea}>
                        <View style={styles.backButton}>
                            <DefaultButton onPress={switchToLogin} title="<"/>
                        </View>
                        <View style={styles.SignupButton}>
                            <DefaultButton onPress={handleRegister} title="Sign up"/>
                        </View>
                    </View>

                    {loading && <ActivityIndicator size="large" color="#0000ff"/>}
                    {error && <Text style={styles.errorText}>{error}</Text>}
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
    buttonArea: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    backButton: {
        flex: 1,
    },
    SignupButton: {
        flex: 4,
        marginLeft: scaleFont(10),
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: scaleFont(10),
    },

});

export default RegisterModal;
