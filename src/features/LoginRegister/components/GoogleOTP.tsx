import React from 'react';
import {Alert} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {Ionicons} from "@expo/vector-icons";
import {CustomButton} from "@/src/features/LoginRegister/components/CustomButton";

// Register for Web Browser Result
WebBrowser.maybeCompleteAuthSession();

interface GoogleOTPProps {
    onSuccess?: (user: string) => void; // Optional success callback
}

const GoogleOTP: React.FC<GoogleOTPProps> = () => {


    const handleSignIn = async () => {
        Alert.alert("Sign in with Google is not yet implemented.");
    };

    return (

        <CustomButton onPress={handleSignIn} title={"Sign in with Google"}
                      icon={<Ionicons name="logo-google" size={20} color="#000"/>}/>
    );
};

export default GoogleOTP;