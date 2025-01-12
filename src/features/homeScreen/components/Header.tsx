import React from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import AddressBar from "@/src/features/homeScreen/components/AddressBar";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/types/navigation';

interface HeaderProps {
    activeTab: string;
}

const Header: React.FC<HeaderProps> = ({activeTab}) => {
    const insets = useSafeAreaInsets();

    return (
        <Animated.View
            style={[
                styles.header,
                {paddingTop: insets.top},
                activeTab === 'HomeMapView' ? styles.transparentHeader : null,
            ]}
        >
            <View style={styles.container}>
                <View style={styles.topRow}>
                    <View style={styles.addressBarContainer}>
                        <AddressBar/>
                    </View>
                    <View style={styles.iconContainer}>
                        <FavoritesBar/>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

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
            <Ionicons name="heart-outline" size={scaleFont(24)} color="#000"/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderColor: '#b2f7a5',
        borderBottomLeftRadius: scaleFont(20),
        borderBottomRightRadius: scaleFont(20),
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
        overflow: 'hidden',
        borderWidth: 1,
        borderTopWidth: 0,
        height: scaleFont(110),
    },
    container: {
        flex: 1,
        paddingHorizontal: scaleFont(10),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressBarContainer: {
        maxWidth: '65%',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    favoritesBarContainer: {
        paddingRight: scaleFont(10),
    },
    transparentHeader: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
    },
});

export default Header;
