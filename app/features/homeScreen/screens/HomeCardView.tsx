import React, {useCallback} from 'react';
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {Restaurant} from "@/store/slices/restaurantSlice";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import RestaurantList from "@/app/features/homeScreen/components/RestaurantCard";
import {Feather} from '@expo/vector-icons';

interface HomeCardViewProps {
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const HomeCardView: React.FC<HomeCardViewProps> = ({onScroll}) => {
    const {restaurantsProximity, loading, error} = useSelector(
        (state: RootState) => state.restaurant
    );

    const renderContent = useCallback(({restaurant}: { restaurant: Restaurant }) => (
        <View>
            <Text style={styles.cardText}>{restaurant.restaurantName}</Text>
            <View style={styles.restaurantDetails}>
                <Text style={styles.cardText}>{restaurant.restaurantDescription}</Text>
                <Text style={styles.cardText}>{restaurant.category}</Text>
                <Text style={styles.cardText}>⭐ {restaurant.rating}</Text>
            </View>
        </View>
    ), []);

    const renderRestaurantItem = useCallback(
        ({item}: { item: Restaurant }) => (
            <View style={styles.restaurantCard}>
                {renderContent({restaurant: item})}
            </View>
        ),
        [renderContent]
    );

    return (
        <View style={styles.safeArea}>
            <View style={styles.topBar}>
                <Text style={styles.title}>Restaurants in Area</Text>
            </View>

            <View style={styles.container}>
                {loading ? (
                    // Loading State
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#50703C"/>
                        <Text style={styles.loadingText}>Loading restaurants...</Text>
                    </View>
                ) : error || restaurantsProximity.length === 0 ? (
                    // No Data State
                    <View style={styles.noDataContainer}>
                        <Feather name="frown" size={48} color="#555"/>
                        <Text style={styles.noDataTitle}>No Restaurants Found</Text>
                        <Text style={styles.noDataMessage}>
                            There are no restaurants available in your area currently.
                        </Text>
                    </View>
                ) : (
                    // Data Loaded State
                    <ScrollView
                        onScroll={onScroll}
                        style={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        decelerationRate="normal"
                        scrollEventThrottle={16}
                        renderToHardwareTextureAndroid
                        overScrollMode="never"
                        bounces={false}
                    >
                        <RestaurantList restaurants={restaurantsProximity}/>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    topBar: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF4444',
        marginTop: 10,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 10,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    noDataTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 10,
        textAlign: 'center',
    },
    noDataMessage: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 10,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginVertical: 8,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
    },
    restaurantDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
});

export default HomeCardView;
