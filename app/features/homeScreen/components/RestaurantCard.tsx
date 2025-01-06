import React, {useCallback} from "react";
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Restaurant} from "@/store/slices/restaurantSlice";

interface RestaurantListProps {
    restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({restaurants}) => {
    const handleFavoritePress = useCallback((id: string) => {
        // Call the add-to-favorites API (not implemented yet)
        console.log(`Add restaurant with ID ${id} to favorites`);
    }, []);
    const renderRestaurantItem = ({item}: { item: Restaurant }) => (
        <View style={styles.restaurantCard}>
            {/* Image with heart icon */}
            <View style={styles.imageContainer}>
                <Image source={{uri: item.image_url}} style={styles.image}/>
                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => handleFavoritePress(item.id)}
                >
                    <View style={styles.heartIcon}>
                        <Text style={styles.heartText}>♡</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Restaurant Details */}
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
    );


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
    restaurantCard: {
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: 160,
    },
    heartButton: {
        position: "absolute",
        top: 8,
        right: 8,
        borderRadius: 20,
        backgroundColor: "#fff",
        padding: 6,
        elevation: 2,
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
        color: "#FFD700", // Gold color for the star
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
