import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Define the RootStackParamList for navigation
type RootStackParamList = {
    AccountScreen: undefined;
};

type AccountBarNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AccountScreen'>;

const AccountBar: React.FC = () => {
    const navigation = useNavigation<AccountBarNavigationProp>();

    const handleRouteToAccountScreen = () => {
        navigation.navigate('AccountScreen'); // Navigate to AccountScreen
    };

    return (
        <TouchableOpacity onPress={handleRouteToAccountScreen} style={styles.accountBarContainer}>
            <Ionicons name="person" size={scaleFont(24)} color="#999"/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    accountBarContainer: {
        paddingHorizontal: scaleFont(10),
    },
});

export default AccountBar;
