import React from 'react';
import {StyleSheet, TouchableOpacity,} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from "@/src/utils/navigation";


export const GoBack: React.FC = () => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();


    return (
        <TouchableOpacity
            testID="go-back-button"
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
        >
            <Feather name="arrow-left" size={24} color="#333"/>
        </TouchableOpacity>
    );
};

// Keep the old name for backward compatibility
export const GoBackIcon = GoBack;

const styles = StyleSheet.create({

    iconButton: {
        padding: 8,
        zIndex: 9999,
    },

});

