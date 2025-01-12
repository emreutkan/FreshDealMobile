// screens/FavoritesScreen.tsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import RestaurantList from '@/src/features/homeScreen/components/RestaurantCard';

const FavoritesScreen: React.FC = () => {
    // Assume favorites are stored in state.restaurant.favorites
    const favorites = useSelector((state: RootState) => state.restaurant.favorites);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Favorite Restaurants</Text>
            {favorites && favorites.length > 0 ? (
                <RestaurantList
                    restaurants={favorites}
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
