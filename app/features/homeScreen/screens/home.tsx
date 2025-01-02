import React, {useMemo} from 'react';
import {FlatList, Image, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';

interface Restaurant {
    id: string;
    name: string;
    image: any;
    rating?: number;
    deliveryTime?: string;
    minOrder?: string;
}

const AfterLoginScreen = () => {
    // Mock Data for Favorites
    const data = useMemo(() => ({
        favorites: [
            {id: 'f1', name: 'Favorite Place 1', image: require('@/assets/images/meal.png')},
            {id: 'f2', name: 'Favorite Place 2', image: require('@/assets/images/meal.png')},
            {id: 'f3', name: 'Favorite Place 3', image: require('@/assets/images/meal.png')},
        ],
        recentlyOrdered: [
            {id: 'f1', name: 'Favorite Place 1', image: require('@/assets/images/meal.png')},
            {id: 'f2', name: 'Favorite Place 2', image: require('@/assets/images/meal.png')},
            {id: 'f3', name: 'Favorite Place 3', image: require('@/assets/images/meal.png')},
        ],

        restaurantsInArea: [
            {id: 'f1', name: 'Favorite Place 1', image: require('@/assets/images/meal.png')},
            {id: 'f2', name: 'Favorite Place 2', image: require('@/assets/images/meal.png')},
            {id: 'f3', name: 'Favorite Place 3', image: require('@/assets/images/meal.png')},
        ],
    }), []);


    const renderHorizontalItem = useMemo(() => ({item}: { item: Restaurant }) => (
        <View style={styles.card}>
            <Image
                source={item.image}
                style={styles.cardImage}
                // Add loading optimization for images
                // loading="lazy"
                // Add fade-in animation for images
                fadeDuration={300}
            />
            <Text style={styles.cardText}>{item.name}</Text>
        </View>
    ), []);

    const renderRestaurantItem = useMemo(() => ({item}: { item: Restaurant }) => (
        <View style={styles.restaurantCard}>
            <Image
                source={item.image}
                style={styles.restaurantImage}
                // loading="lazy"
                fadeDuration={300}
            />
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.restaurantDetails}>
                    <Text style={styles.detailText}>⭐ {item.rating}</Text>
                    <Text style={styles.detailText}>🕒 {item.deliveryTime}</Text>
                    <Text style={styles.detailText}>Min: {item.minOrder}</Text>
                </View>
            </View>
        </View>
    ), []);

    const HorizontalSection = useMemo(() => ({title, data}: { title: string; data: Restaurant[] }) => (
        <View>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                data={data}
                renderItem={renderHorizontalItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                // Add performance optimizations
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={5}
                initialNumToRender={5}
                // Add momentum scroll for smoother experience
                decelerationRate="fast"
                // Prevent layout thrashing
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                }}
            />
        </View>
    ), [renderHorizontalItem]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            // Add scroll performance optimizations
            removeClippedSubviews={true}
            // Add momentum scrolling properties
            decelerationRate="normal"
            scrollEventThrottle={16}
            // Enable hardware acceleration
            renderToHardwareTextureAndroid
            // Improve scroll behavior
            overScrollMode="never"
            bounces={false}
            // Maintain scroll position during updates
            maintainVisibleContentPosition={{
                minIndexForVisible: 0,
            }}
        >
            <HorizontalSection title="Favorites" data={data.favorites}/>
            <HorizontalSection title="Recently Ordered" data={data.recentlyOrdered}/>

            <Text style={styles.sectionTitle}>Restaurants in Area</Text>
            {data.restaurantsInArea.map((restaurant) => (
                <View key={restaurant.id}>
                    {renderRestaurantItem({item: restaurant})}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        marginTop: 20,
    },
    listContainer: {
        paddingVertical: 10,
    },
    // card: {
    //     width: 150,
    //     marginRight: 12,
    //     borderRadius: 8,
    //     backgroundColor: '#f9f9f9',
    //     alignItems: 'center',
    //     padding: 8,
    //     shadowColor: '#000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 3,
    // },
    card: {
        width: 150,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        padding: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
                // Add hardware acceleration for Android
                renderToHardwareTextureAndroid: true,
            },
        }),
    },
    cardImage: {
        width: 130,
        height: 80,
        borderRadius: 8,
        marginBottom: 5,
    },
    cardText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
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
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    restaurantInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    restaurantDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#666',
    },
});

export default AfterLoginScreen;