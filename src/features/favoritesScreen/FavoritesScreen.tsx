// screens/FavoritesScreen.tsx
import React, {useMemo} from 'react';
import {ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from "@/src/types/store";
import RestaurantList from '@/src/features/homeScreen/components/RestaurantCard';
import {MaterialIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";

const FavoritesScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);
    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity);
    const loading = useSelector((state: RootState) => state.restaurant.restaurantsProximityLoading);

    const favoriteRestaurants = useMemo(() => {
        return restaurants.filter((restaurant) => favoriteRestaurantsIDs.includes(restaurant.id));
    }, [restaurants, favoriteRestaurantsIDs]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#50703C"/>
            </View>
        );
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>

            <View style={[styles.safeArea, {paddingTop: insets.top}]}>
                <View style={styles.topBar}>
                    <GoBackIcon/>
                    <Text style={styles.title}>Favorite Restaurants</Text>
                    <View style={styles.placeholder}/>
                </View>

                <ScrollView style={styles.container}>
                    {favoriteRestaurants && favoriteRestaurants.length > 0 ? (
                        <View style={styles.listContainer}>
                            <RestaurantList restaurants={favoriteRestaurants}/>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="favorite-border" size={64} color="#50703C"/>
                            </View>
                            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                            <Text style={styles.emptyText}>
                                Start adding restaurants to your favorites to see them here
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    placeholder: {
        width: 32, // Same width as GoBackIcon for symmetry
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    listContainer: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 100,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 3,
        borderColor: '#50703C',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Poppins-Regular',
    },
});

export default FavoritesScreen;