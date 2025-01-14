import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {Feather, Ionicons} from "@expo/vector-icons";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface RestaurantHeaderProps {
    isScrolled: boolean;
    restaurantName: string;
    isMapActive: boolean;                // <-- New prop
    onToggleMap: (active: boolean) => void; // <-- New prop
}


const SearchBar: React.FC = () => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();
    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: scaleFont(8)}}>

            <Feather name="search" size={24} color="#000"/>
        </TouchableOpacity>
    )
}


const CartBar: React.FC = () => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: scaleFont(8)}}>

            <Ionicons name="cart-outline" size={scaleFont(24)} color="#000"/>
        </TouchableOpacity>
    );
};

const GoBackButton: React.FC = () => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: scaleFont(8)}}>
            <Feather name="arrow-left" size={24} color="#333"/>
        </TouchableOpacity>
    )
}
const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
                                                               isScrolled,
                                                               restaurantName,
                                                               isMapActive,
                                                               onToggleMap
                                                           }) => {


    const inset = useSafeAreaInsets()
    return (
        <View style={[
            styles.header, {paddingTop: inset.top}
        ]}>
            <View style={styles.topRow}>
                <GoBackButton/>
                <Text style={styles.restaurantName}>
                    {restaurantName}
                </Text>

                <View style={styles.iconContainer}>
                    <CartBar/>
                    <SearchBar/>
                </View>
            </View>
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, !isMapActive && styles.activeTabButton]}
                    onPress={() => onToggleMap(false)}
                >
                    <Text style={[styles.tabButtonText, !isMapActive && styles.activeTabButtonText]}>
                        Details
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, isMapActive && styles.activeTabButton]}
                    onPress={() => onToggleMap(true)}
                >
                    <Text style={[styles.tabButtonText, isMapActive && styles.activeTabButtonText]}>
                        Location
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        // flex: 1,
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
    },

    topRow: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    restaurantName: {
        fontSize: scaleFont(20),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: scaleFont(5),
    },
    tabButton: {
        paddingHorizontal: scaleFont(20),
        paddingVertical: scaleFont(8),
        // borderRadius: scaleFont(20),
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    tabButtonText: {
        fontSize: scaleFont(14),
        color: '#333',
    },
    activeTabButton: {
        backgroundColor: '#4CAF50',
    },
    activeTabButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default RestaurantHeader;
