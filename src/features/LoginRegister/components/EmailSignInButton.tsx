import React from "react";
import {Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {ButtonStyles} from "@/src/styles/ButtonStyles";

export const EmailSignInButton: React.FC = () => (
    <View style={ButtonStyles.default}>
        <Ionicons name="mail-outline" size={20} color="#000" style={ButtonStyles.ButtonIcon}/>
        <Text style={ButtonStyles.ButtonText}>Sign in with Email</Text>
    </View>
);