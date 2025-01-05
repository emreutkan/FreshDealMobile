import React, {useMemo} from 'react';
import {FlatList, StyleSheet, Text, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {Restaurant} from '@/store/slices/restaurantSlice';
import RestaurantsBottomSheet from "@/app/features/homeScreen/components/RestaurantsBottomSheet";
import RestaurantsOnMap from "@/app/features/homeScreen/components/RestaurantsOnMap";

const HomeMapView = () => {

    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity || []);

    // Render the restaurant item
    const renderRestaurantItem = useMemo(
        () => ({item}: { item: Restaurant }) => (
            <View style={styles.restaurantCard}>
                {/*<Image*/}
                {/*    // source={{uri: item.restaurantImageUrl || ''}}*/}
                {/*    style={styles.restaurantImage}*/}
                {/*    fadeDuration={300}*/}
                {/*/>*/}
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{item.restaurantDescription}</Text>
                    <View style={styles.restaurantDetails}>
                        {item.rating !== undefined && (
                            <Text style={styles.detailText}>⭐ {item.rating}</Text>
                        )}
                    </View>
                </View>
            </View>
        ),
        []
    );

    // Fallback or loading content
    const renderMapView = () => {
        return (
            <>
                <RestaurantsOnMap restaurants={restaurants}
                                  setLatitudeDelta={0.01} setLongitudeDelta={0.01}></RestaurantsOnMap>


                <RestaurantsBottomSheet children={
                    <>
                        <Text style={styles.sectionTitle}>Restaurants in Area</Text>
                        <FlatList
                            data={restaurants}
                            renderItem={renderRestaurantItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    </>
                }></RestaurantsBottomSheet>

            </>
        );
    };

    return <View style={styles.container}>
        {renderMapView()}
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },


    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
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
    listContainer: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRestaurantsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRestaurantsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },

});

export default HomeMapView;
