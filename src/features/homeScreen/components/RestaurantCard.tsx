import React, {useCallback} from "react";
import {FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Restaurant} from "@/store/slices/restaurantSlice";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/types/navigation";
import {useNavigation} from "@react-navigation/native";

interface RestaurantListProps {
    restaurants: Restaurant[];
    onRestaurantPress: (restaurantId: string) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;


const RestaurantList: React.FC<RestaurantListProps> = ({restaurants, onRestaurantPress}) => {
    const navigation = useNavigation<NavigationProp>();
    const [pressedId, setPressedId] = React.useState<string | null>(null);

    const handleRestaurantPress = useCallback((restaurantId: string) => {
        navigation.navigate('RestaurantDetails', {restaurantId});
    }, [navigation]);

    const handleFavoritePress = useCallback((id: string) => {
        console.log(`Add restaurant with ID ${id} to favorites`);
    }, []);

    const renderRestaurantItem = ({item}: { item: Restaurant }) => {
        const isPressed = pressedId === item.id;

        return (
            <TouchableOpacity
                onPress={() => handleRestaurantPress(item.id)}
                onPressIn={() => setPressedId(item.id)}
                onPressOut={() => setPressedId(null)}
                activeOpacity={1}
                style={[
                    styles.touchableContainer,
                    isPressed && styles.touchablePressed
                ]}
            >
                <View style={[
                    styles.restaurantCard,
                    isPressed && styles.cardPressed
                ]}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{uri: item.image_url}}
                            style={[
                                styles.image,
                                isPressed && styles.imagePressed
                            ]}
                        />
                        <TouchableOpacity
                            style={styles.heartButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleFavoritePress(item.id);
                            }}
                        >
                            <View style={styles.heartIcon}>
                                <Text style={styles.heartText}>♡</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{item.restaurantName}</Text>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.rating}>
                                    {(item.rating ?? 0).toFixed(1)}
                                </Text>
                                <Text style={styles.voteCount}>
                                    ({item.ratingCount ?? 0})
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.distance}>
                            Within {(item.distance_km ?? 0).toFixed(1)} km
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={restaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
        backgroundColor: "#fff",
    },
    touchableContainer: {
        marginBottom: 16,
        transform: [{scale: 1}],
        transition: 'transform 0.2s',
    },
    touchablePressed: {
        transform: [{scale: 0.98}], // Slight retraction when pressed
    },
    restaurantCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        transition: 'all 0.2s',
    },
    cardPressed: {
        backgroundColor: "#f0f0f0", // Slightly darker background when pressed
        shadowOpacity: 0.05,
        elevation: 1,
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: 160,
        transition: 'filter 0.2s',
    },
    imagePressed: {
        opacity: 0.9, // Slight dimming effect when pressed
        ...(Platform.OS === 'ios' ? {
            filter: 'brightness(95%)',
        } : {}),
    },
    heartButton: {
        position: "absolute",
        top: 8,
        right: 8,
        borderRadius: 20,
        backgroundColor: "#fff",
        padding: 6,
        elevation: 2,
        zIndex: 1,
    },
    heartIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#fff",
    },
    heartText: {
        fontSize: 16,
        color: "#FF0000",
    },
    detailsContainer: {
        padding: 12,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFD700",
    },
    voteCount: {
        fontSize: 12,
        color: "#666",
    },
    distance: {
        fontSize: 12,
        color: "#777",
        marginTop: 4,
    },
});

export default RestaurantList;