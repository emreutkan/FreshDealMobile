import React from "react";
import {Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const {width} = Dimensions.get('window');
const FAVORITE_CARD_WIDTH = width * 0.7; // 70% of screen width
const FAVORITE_CARD_MARGIN = 8;

interface FavoriteRestaurantListProps {
    restaurants: Restaurant[];
    onRestaurantPress: (restaurantId: string) => void;
}

const FavoriteRestaurantList: React.FC<FavoriteRestaurantListProps> = ({
                                                                           restaurants,
                                                                           onRestaurantPress,
                                                                       }) => {
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);

    // Filter only favorite restaurants
    const favoriteRestaurants = restaurants.filter(restaurant =>
        favoriteRestaurantsIDs.includes(restaurant.id)
    );

    const renderFavoriteItem = ({item}: { item: Restaurant }) => {
        return (
            <TouchableOpacity
                onPress={() => onRestaurantPress(item.id)}
                activeOpacity={0.97}
                style={styles.favoriteTouchableContainer}
            >
                <View style={styles.favoriteCard}>
                    <View style={styles.favoriteImageContainer}>
                        {item.image_url ? (
                            <Image
                                source={{
                                    uri: item.image_url.replace('127.0.0.1', '192.168.1.3'),
                                }}
                                style={styles.favoriteImage}
                            />
                        ) : (
                            <View style={styles.favoriteNoImageContainer}>
                                <MaterialCommunityIcons name="food-fork-drink" size={30} color="#ccc"/>
                            </View>
                        )}
                    </View>
                    <View style={styles.favoriteDetailsContainer}>
                        <Text style={styles.favoriteTitle} numberOfLines={1}>
                            {item.restaurantName || 'Unnamed Restaurant'}
                        </Text>
                        <View style={styles.favoriteRatingContainer}>
                            <MaterialCommunityIcons name="star" size={14} color="#FFC107"/>
                            <Text style={styles.favoriteRating}>
                                {(item.rating ?? 0).toFixed(1)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (favoriteRestaurants.length === 0) {
        return null;
    }

    return (
        <View style={styles.favoritesContainer}>
            <Text style={styles.favoritesTitle}>Your Favorites</Text>
            <FlatList
                data={favoriteRestaurants}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => `favorite-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.favoriteListContainer}
                snapToInterval={FAVORITE_CARD_WIDTH + FAVORITE_CARD_MARGIN * 2}
                decelerationRate="fast"
                snapToAlignment="center"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    favoritesContainer: {
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
    },
    favoritesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 16,
        marginBottom: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    favoriteListContainer: {
        paddingHorizontal: FAVORITE_CARD_MARGIN,
    },
    favoriteTouchableContainer: {
        width: FAVORITE_CARD_WIDTH,
        marginHorizontal: FAVORITE_CARD_MARGIN,
    },
    favoriteCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    favoriteImageContainer: {
        height: 120,
    },
    favoriteImage: {
        width: '100%',
        height: '100%',
    },
    favoriteNoImageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteDetailsContainer: {
        padding: 12,
    },
    favoriteTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    favoriteRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    favoriteRating: {
        fontSize: 12,
        fontWeight: '500',
        color: '#212121',
        fontFamily: 'Poppins-Regular',
    },
});

export default FavoriteRestaurantList;