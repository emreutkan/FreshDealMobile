import React from "react";
import {useNavigation} from "@react-navigation/native";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FavoritesScreen'>;

const FavoritesBar: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleRouteToFavoritesScreen = () => {
        // Navigate to FavoritesScreen
        navigation.navigate('FavoritesScreen');
    };

    return (
        <TouchableOpacity
            onPress={handleRouteToFavoritesScreen}
            style={styles.favoritesBarContainer}
            accessibilityLabel="View Favorites"
            accessibilityHint="Navigates to your favorited restaurants"
        >
            <Ionicons name="heart-outline" size={24} color="#000"/>
        </TouchableOpacity>
    );
};

export default FavoritesBar;

const styles = StyleSheet.create({
    favoritesBarContainer: {
        padding: 8,
    },
});
