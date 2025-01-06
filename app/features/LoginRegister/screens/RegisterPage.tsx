import React from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import DefaultButton from "../../DefaultButton";
import {scaleFont} from "@/app/utils/ResponsiveFont";
import EmailLoginField from "@/app/features/LoginRegister/components/EmailInput";
import PhoneInput from "../components/PhoneInput";
import {useRouter} from "expo-router";
import NameSurnameInputField from "../components/NameSurnameInputField";
import PasswordInput from "@/app/features/LoginRegister/components/PasswordInput";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, store} from "@/store/store";
import {getUserData, loginUser, registerUser} from "@/store/thunks/userThunks";
import {setToken} from "@/store/slices/userSlice";

const RegisterScreen: React.FC = () => {
    const router = useRouter();
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
        console.log("register button pressed")
        if (!validateInput()) return;
        console.log("input validated")
        try {
            const result = await dispatch(
                registerUser({
                    name_surname,
                    email,
                    phone_number: selectedCode + phoneNumber,
                    password,
                    role: 'customer'
                })
            ).unwrap();
            console.log("result = ", result)
            if (result.message == "User registered successfully!") { // Adjust based on your API response structure

                const result = await dispatch(
                    loginUser({
                        email: email,
                        phone_number: selectedCode + phoneNumber,
                        password: password,
                        login_type: "email",
                        password_login: true,
                    })
                ).unwrap(); // Use unwrap() to handle fulfilled/rejected states
                if (result.success) { // Adjust based on your API response structure
                    console.log('store.getState().user before setToken = ', store.getState().user);

                    dispatch(setToken(result.token));
                    dispatch(getUserData({token: result.token}));
                    console.log('store.getState().user = after setToken', store.getState().user);

                    router.push('/features/homeScreen/screens/Home');
                } else {
                    Alert.alert("Login Failed", result.message || "Something went wrong.");
                }
            } else {
                Alert.alert("Login Failed", result.message || "Something went wrong.");
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
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
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
                            <DefaultButton onPress={() => router.back()} title="<"/>
                        </View>
                        <View style={styles.SignupButton}>
                            <DefaultButton onPress={handleRegister} title="Sign up"/>
                        </View>
                    </View>

                    {loading && <ActivityIndicator size="large" color="#0000ff"/>}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </ScrollView>
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

export default RegisterScreen;
