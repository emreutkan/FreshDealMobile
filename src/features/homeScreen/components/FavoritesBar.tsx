import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {scaleFont} from "@/src/utils/ResponsiveFont";

const FavoritesBar: React.FC = () => {

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
        paddingRight: scaleFont(10),
    },
});

export default FavoritesBar;
