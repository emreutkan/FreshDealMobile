import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {Feather, Ionicons} from "@expo/vector-icons";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/types/navigation";
import {useNavigation} from "@react-navigation/native";

interface RestaurantHeaderProps {
    isScrolled: boolean;
    restaurantName: string | '';
}


const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({isScrolled, restaurantName}) => {
    const CollapsedSearchBar: React.FC = React.memo(() => (
        <View style={styles.searchBarContainer}>
            <TouchableOpacity>
                <Feather name="search" size={24} color="#000"/>
            </TouchableOpacity>
        </View>
    ));


    const CartBar: React.FC = () => {

        const handleRouteToCartScreen = () => {

        };

        return (
            <TouchableOpacity
                onPress={handleRouteToCartScreen}
                style={styles.favoritesBarContainer}
            >
                <Ionicons name="cart-outline" size={scaleFont(24)} color="#000"/>
            </TouchableOpacity>
        );
    };

    const animation = useRef(new Animated.Value(isScrolled ? 1 : 0)).current;
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();
    useEffect(() => {
        Animated.timing(animation, {
            toValue: isScrolled ? 1 : 0,
            duration: 320,
            useNativeDriver: false,
        }).start();
    }, [isScrolled]);

    // Interpolations for dynamic styles
    const headerHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [scaleFont(100), scaleFont(60)], // Expanded to Collapsed height
    });

    const searchBarOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1], // ExpandedSearchBar to CollapsedSearchBar
    });

    return (
        <Animated.View style={[styles.header, {height: headerHeight}]}>
            <View style={styles.container}>

                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: scaleFont(8)}}>
                        <Feather name="arrow-left" size={24} color="#333"/>
                    </TouchableOpacity>
                    <Text style={styles.restaurantName}>
                        {restaurantName}
                    </Text>

                    <View style={styles.iconContainer}>
                        <CartBar/>
                        {isScrolled && (
                            <Animated.View style={[styles.collapsedSearchWrapper, {opacity: searchBarOpacity}]}>
                                <CollapsedSearchBar/>
                            </Animated.View>
                        )}
                    </View>
                </View>


            </View>
        </Animated.View>
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
    },
    container: {
        flex: 1,
        paddingHorizontal: scaleFont(10),
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
        flex: 1,
        textAlign: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    collapsedSearchWrapper: {
        marginLeft: scaleFont(10),
    },
    expandedSearchWrapper: {
        // marginTop: scaleFont(10),
    },
    expandedSearchBarContainer: {
        paddingTop: scaleFont(10),
        paddingHorizontal: scaleFont(10),
    },
    expandedSearchBar: {
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
    },
    searchBarContainer: {
        paddingRight: scaleFont(10),
    },
    favoritesBarContainer: {
        paddingRight: scaleFont(10),
    },
});

export default RestaurantHeader;
