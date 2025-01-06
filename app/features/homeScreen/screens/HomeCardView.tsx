import React, {useCallback} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Restaurant} from "@/store/slices/restaurantSlice";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import RestaurantList from "@/app/features/homeScreen/components/RestaurantCard";

interface HomeCardViewProps {
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const HomeCardView: React.FC<HomeCardViewProps> = ({onScroll}) => {
    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity || []);
    console.log(restaurants);

    const renderContent = useCallback(({restaurant}: { restaurant: Restaurant }) => (
        <View>
            <Text style={styles.cardText}>{restaurant.restaurantName}</Text>
            <View style={styles.restaurantDetails}>
                <Text style={styles.cardText}>{restaurant.restaurantDescription}</Text>
                <Text style={styles.cardText}>{restaurant.category}</Text>
                <Text style={styles.cardText}>{restaurant.rating}</Text>
            </View>
        </View>
    ), []);

    const renderRestaurantItem = ({item}: { item: Restaurant }) => (
        <View style={styles.restaurantCard}>
            {renderContent({restaurant: item})}
        </View>
    );

    return (
        <ScrollView
            onScroll={onScroll}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            decelerationRate="normal"
            scrollEventThrottle={16}
            renderToHardwareTextureAndroid
            overScrollMode="never"
            bounces={false}
        >
            {/*<Text style={styles.sectionTitle}>Restaurants in Area</Text>*/}
            {/*<FlatList*/}
            {/*    data={restaurants}*/}
            {/*    renderItem={renderRestaurantItem}*/}
            {/*    keyExtractor={(item) => item.id.toString()}*/}
            {/*    horizontal*/}
            {/*    showsHorizontalScrollIndicator={false}*/}
            {/*    contentContainerStyle={styles.listContainer}*/}
            {/*/>*/}
            <RestaurantList restaurants={restaurants}/>
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
    restaurantDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
});

export default HomeCardView;
