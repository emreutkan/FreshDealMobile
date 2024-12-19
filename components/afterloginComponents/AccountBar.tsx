import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import {useRouter} from "expo-router";

const AccountBar: React.FC = () => {
    const router = useRouter();

    const handleRouteToAccountScreen = () => {
        router.push('/screens/tabs/account/accountScreen');
    };

    return (
        <TouchableOpacity
            onPress={handleRouteToAccountScreen}
            style={styles.accountBarContainer}
        >
            <Ionicons name="person" size={24} color="#999"/>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    accountBarContainer: {
        padding: scaleFont(10),
    },
});

export default AccountBar;
