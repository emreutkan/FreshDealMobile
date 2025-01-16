import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ButtonStyles} from "@/src/styles/ButtonStyles";

export const GoogleSignInButton: React.FC = () => (
    <TouchableOpacity style={ButtonStyles.default}>
        <Ionicons name="logo-google" size={20} color="#000" style={ButtonStyles.ButtonIcon}/>
        <Text style={ButtonStyles.ButtonText}>Sign in with Google</Text>
    </TouchableOpacity>
);


