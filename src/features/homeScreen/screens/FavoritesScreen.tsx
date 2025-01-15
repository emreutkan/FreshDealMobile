// screens/FavoritesScreen.tsx
import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/redux/store';
import RestaurantList from '@/src/features/homeScreen/components/RestaurantCard';

const FavoritesScreen: React.FC = () => {
    // Get list of favorite restaurant IDs from the Redux store
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);
    // Get the complete list of restaurants (for example, loaded via proximity API)
    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity);

    // Create a filtered list of restaurants that are marked as favorites.
    const favoriteRestaurants = useMemo(() => {
        return restaurants.filter((restaurant) => favoriteRestaurantsIDs.includes(restaurant.id));
    }, [restaurants, favoriteRestaurantsIDs]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Favorite Restaurants</Text>
            {favoriteRestaurants && favoriteRestaurants.length > 0 ? (
                <RestaurantList
                    restaurants={favoriteRestaurants}
                    onRestaurantPress={(restaurantId) =>
                        console.log('Selected favorite restaurant:', restaurantId)
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        You haven’t favorited any restaurants yet.
                    </Text>
                </View>
            )}
        </View>
    );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        color: '#333',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});
