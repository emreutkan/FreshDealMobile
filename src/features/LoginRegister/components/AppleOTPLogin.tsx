import * as AppleAuthentication from "expo-apple-authentication";
import {Alert, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {MaterialIcons} from "@expo/vector-icons"; // Make sure you have this imported

interface AppleOTPProps {
    onSuccess?: (user: string) => void;
    useCustomButton?: boolean; // Add this prop to toggle between native and custom button
}

const AppleOTP: React.FC<AppleOTPProps> = ({onSuccess, useCustomButton = false}) => {
    const handleAppleSignIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            Alert.alert('Apple Sign-In Success', `User: ${credential.user}`);
            onSuccess?.(credential.user);
        } catch (e: any) {
            if (e.code === 'ERR_CANCELED') {
                Alert.alert('Sign-In Canceled', 'You canceled the sign-in process.');
            } else {
                Alert.alert('Error', 'Apple Sign-In failed');
            }
        }
    };

    if (Platform.OS === 'ios') {
        return (
            <View style={styles.container}>
                {useCustomButton ? (
                    <TouchableOpacity
                        style={styles.customAppleButton}
                        onPress={handleAppleSignIn}
                    >
                        <MaterialIcons name="apple" size={20} color="#FFFFFF"/>
                        <Text style={styles.customButtonText}>
                            Sign in with Apple
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={12}
                        style={styles.appleButton}
                        onPress={handleAppleSignIn}
                    />
                )}
            </View>
        );
    }
    return null;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: scaleFont(10),
    },
    appleButton: {
        height: scaleFont(50),
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    customAppleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        borderRadius: scaleFont(16),
        height: scaleFont(50),
        width: '100%',
        paddingHorizontal: scaleFont(20),
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    customButtonText: {
        color: '#FFFFFF',
        fontSize: scaleFont(16),
        fontFamily: 'Poppins-Regular',
        marginLeft: scaleFont(10),
    },
});

export default AppleOTP;