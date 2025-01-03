// AfterLoginScreen.tsx
import React, {useMemo, useRef} from 'react';
import {FlatList, Image, Platform, StyleSheet, Text, View,} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";

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
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
    const data = useMemo(() => ({
        favorites: [
            {id: 'f1', name: 'Favorite Place 1', image: require('@/assets/images/meal.png')},
            {id: 'f2', name: 'Favorite Place 2', image: require('@/assets/images/meal.png')},
            {id: 'f3', name: 'Favorite Place 3', image: require('@/assets/images/meal.png')},
        ],
        recentlyOrdered: [
            {id: 'r1', name: 'Recently Ordered 1', image: require('@/assets/images/meal.png')},
            {id: 'r2', name: 'Recently Ordered 2', image: require('@/assets/images/meal.png')},
            {id: 'r3', name: 'Recently Ordered 3', image: require('@/assets/images/meal.png')},
        ],
        restaurantsInArea: [
            {
                id: 'a1',
                name: 'Area Restaurant 1',
                image: require('@/assets/images/meal.png'),
                rating: 4.5,
                deliveryTime: '30 mins',
                minOrder: '$15'
            },
            {
                id: 'a2',
                name: 'Area Restaurant 2',
                image: require('@/assets/images/meal.png'),
                rating: 4.0,
                deliveryTime: '25 mins',
                minOrder: '$10'
            },
            {
                id: 'a3',
                name: 'Area Restaurant 3',
                image: require('@/assets/images/meal.png'),
                rating: 4.8,
                deliveryTime: '20 mins',
                minOrder: '$20'
            },
        ],
    }), []);

    const renderHorizontalItem = useMemo(() => ({item}: { item: Restaurant }) => (
        <View style={styles.card}>
            <Image
                source={item.image}
                style={styles.cardImage}
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
                fadeDuration={300}
            />
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.restaurantDetails}>
                    {item.rating !== undefined && <Text style={styles.detailText}>⭐ {item.rating}</Text>}
                    {item.deliveryTime && <Text style={styles.detailText}>🕒 {item.deliveryTime}</Text>}
                    {item.minOrder && <Text style={styles.detailText}>Min: {item.minOrder}</Text>}
                </View>
            </View>
        </View>
    ), []);

    const HorizontalSection = useMemo(() => ({title, data}: { title: string; data: Restaurant[] }) => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                data={data}
                renderItem={renderHorizontalItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={5}
                initialNumToRender={5}
                decelerationRate="fast"
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                }}
            />
        </View>
    ), [renderHorizontalItem]);

    return (
        <View style={styles.container}>
            {/* Uncomment and configure MapView if needed */}
            {/* <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            /> */}

            <FlatList
                data={data.restaurantsInArea}
                renderItem={renderRestaurantItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        <Text style={styles.sectionTitle}>Restaurants in Area</Text>
                    </>
                }
                contentContainerStyle={styles.restaurantsList}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                decelerationRate="normal"
                scrollEventThrottle={16}
                renderToHardwareTextureAndroid
                overScrollMode="never"
                bounces={false}
            />

            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                handleIndicatorStyle={styles.bottomSheetHandle}
            >
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                    <HorizontalSection title="Favorites" data={data.favorites}/>
                    <HorizontalSection title="Recently Ordered" data={data.recentlyOrdered}/>
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    map: {
        height: 200,
        width: '100%',
    },
    sectionContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 16,
    },
    listContainer: {
        paddingLeft: 16,
        paddingVertical: 10,
    },
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
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
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
    bottomSheetContent: {
        padding: 16,
    },
    bottomSheetHandle: {
        backgroundColor: '#ccc',
        width: 40,
        height: 5,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginVertical: 8,
    },
    restaurantsList: {
        paddingBottom: 300, // Adjust based on BottomSheet height
    },
});

export default AfterLoginScreen;
