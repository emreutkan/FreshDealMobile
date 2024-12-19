import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import {useRouter} from "expo-router";

const FavoritesBar: React.FC = () => {
    const router = useRouter();

    const handleRouteToFavoritesScreen = () => {

    };

    return (
        <TouchableOpacity
            onPress={handleRouteToFavoritesScreen}
            style={styles.favoritesBarContainer}
        >
            <Ionicons name="heart-outline" size={scaleFont(24)} color="#000"/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    favoritesBarContainer: {
        padding: scaleFont(10),
    },
});

export default FavoritesBar;
