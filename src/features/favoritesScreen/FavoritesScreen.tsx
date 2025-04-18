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
                <Text style={styles.loadingText}>Loading your favorites...</Text>
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

                <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                    {favoriteRestaurants && favoriteRestaurants.length > 0 ? (
                        <View style={styles.listContainer}>
                            <View style={styles.infoCard}>
                                <MaterialIcons name="info-outline" size={20} color="#50703C"/>
                                <Text style={styles.infoText}>
                                    Your favorite restaurants are shown here for quick access
                                </Text>
                            </View>
                            <RestaurantList restaurants={favoriteRestaurants}/>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="favorite-border" size={64} color="#50703C"/>
                            </View>
                            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                            <Text style={styles.emptyText}>
                                Start adding restaurants to your favorites by tapping the heart icon on restaurants you
                                like
                            </Text>
                            <View style={styles.emptyHintContainer}>
                                <MaterialIcons name="lightbulb-outline" size={20} color="#50703C"/>
                                <Text style={styles.emptyHintText}>
                                    Favorites make it easier to order from restaurants you love
                                </Text>
                            </View>
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
        backgroundColor: '#FFFFFF',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Poppins-Bold',
    },
    placeholder: {
        width: 32,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    listContainer: {
        padding: 16,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#F0F9EB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#50703C',
        fontFamily: 'Poppins-Medium',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#50703C',
        fontFamily: 'Poppins-Medium',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 64,
        paddingBottom: 64,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F9EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#50703C',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        fontFamily: 'Poppins-Bold',
    },
    emptyText: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Poppins-Regular',
        marginBottom: 24,
    },
    emptyHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9EB',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    emptyHintText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#50703C',
        fontFamily: 'Poppins-Regular',
    },
});

export default FavoritesScreen;