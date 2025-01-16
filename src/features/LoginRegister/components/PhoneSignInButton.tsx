import React from "react";
import {Text, View} from "react-native";
import {ButtonStyles} from "@/src/styles/ButtonStyles";
import {Ionicons} from "@expo/vector-icons";

export const PhoneSignInButton: React.FC = () => (
    <View style={ButtonStyles.default}>
        <Ionicons name="call-outline" size={20} color="#000" style={ButtonStyles.ButtonIcon}/>
        <Text style={ButtonStyles.ButtonText}>Sign in with Phone</Text>
    </View>
);
