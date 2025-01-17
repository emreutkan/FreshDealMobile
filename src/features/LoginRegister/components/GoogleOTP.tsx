import React from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {ButtonStyles} from "@/src/styles/ButtonStyles";
import {Ionicons} from "@expo/vector-icons";

// Register for Web Browser Result
WebBrowser.maybeCompleteAuthSession();

interface GoogleOTPProps {
    onSuccess?: (user: string) => void; // Optional success callback
}

const GoogleOTP: React.FC<GoogleOTPProps> = ({onSuccess}) => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        clientId: 'YOUR_WEB_CLIENT_ID', // Changed from expoClientId to clientId
    });

    const handleSignIn = async () => {
        try {
            const result = await promptAsync();

            if (result?.type === 'success') {
                const userInfoResponse = await fetch(
                    'https://www.googleapis.com/userinfo/v2/me',
                    {
                        headers: {Authorization: `Bearer ${result.authentication?.accessToken}`},
                    }
                );

                const userInfo = await userInfoResponse.json();
                Alert.alert('Google Sign-In Success', `User: ${userInfo.email}`);
                onSuccess?.(userInfo.email);
            }
        } catch (e) {
            Alert.alert('Error', 'Google Sign-In failed');
            console.error(e);
        }
    };

    return (
        <TouchableOpacity
            style={ButtonStyles.default}
            onPress={handleSignIn}
            disabled={!request} // Add disabled state when request is not ready
        >
            <Ionicons name="logo-google" size={20} color="#000" style={ButtonStyles.ButtonIcon}/>
            <Text style={ButtonStyles.ButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
    );
};

export default GoogleOTP;