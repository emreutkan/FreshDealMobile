import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {Feather, Ionicons} from "@expo/vector-icons";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CartIcon from "@/src/features/RestaurantScreen/components/CartIcon";

interface RestaurantHeaderProps {
    isScrolled: boolean;
    restaurantName: string;
    isMapActive: boolean;                // <-- New prop
    onToggleMap: (active: boolean) => void; // <-- New prop
    restaurantId: string;
    isPickup: boolean;
    setIsPickup: (pickup: boolean) => void;
}


const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
                                                               isScrolled,
                                                               restaurantName,
                                                               isMapActive,
                                                               onToggleMap,
                                                               restaurantId,
                                                               isPickup,
                                                               setIsPickup,
                                                           }) => {


    const SearchBar: React.FC = () => {

        type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
        const navigation = useNavigation<NavigationProp>();
        return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: scaleFont(8)}}>

                <Feather name="search" size={24} color="#000"/>
            </TouchableOpacity>
        )
    }


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
                    <CartIcon

                    />
                    <SearchBar/>
                </View>
            </View>
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, !isMapActive && styles.activeTabButton]}
                    onPress={() => onToggleMap(false)}
                >
                    <Ionicons name={"reader-outline"} size={scaleFont(20)} color={"#333"}
                              style={{color: !isMapActive ? "#FFF" : "#333",}}/>

                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, isMapActive && styles.activeTabButton]}
                    onPress={() => onToggleMap(true)}
                >
                    <Ionicons name={"earth-outline"} size={scaleFont(20)} color={"#333"}
                              style={{color: isMapActive ? "#FFF" : "#333",}}/>
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
        borderWidth: 2,
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

    },
    tabButton: {
        paddingVertical: scaleFont(8),
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
        backgroundColor: '#b2f7a5',
    },
    activeTabButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default RestaurantHeader;
