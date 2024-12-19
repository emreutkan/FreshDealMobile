import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import {useRouter} from "expo-router";

const AccountBar: React.FC = () => {
    const router = useRouter();

    const handleRouteToAccountScreen = () => {
        router.push('/screens/tabs/account/accountScreen'); // Replace '/account' with your actual route
    };

    return (
        <TouchableOpacity
            onPress={handleRouteToAccountScreen}
            style={styles.searchBarContainer}
        >
            <Feather name="search" size={24} color="#999"/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        padding: scaleFont(10),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(15),
        borderRadius: scaleFont(20),
        backgroundColor: '#f9f9f9',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        maxHeight: scaleFont(60),
        minWidth: scaleFont(120),
    },
});

export default AccountBar;
