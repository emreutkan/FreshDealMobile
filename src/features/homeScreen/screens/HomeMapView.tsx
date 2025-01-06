import React, {useCallback} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {Restaurant} from '@/store/slices/restaurantSlice';
import RestaurantsOnMap from "@/src/features/homeScreen/components/RestaurantsOnMap";

const HomeMapView = () => {

    const restaurants = useSelector((state: RootState) => state.restaurant.restaurantsProximity || []);

    // Use useCallback instead of useMemo
    const renderRestaurantItem = useCallback(
        ({item}: { item: Restaurant }) => (
            <View style={styles.restaurantCard}>
                {/* Uncomment and use Image if needed */}
                {/* <Image
                    source={{ uri: item.restaurantImageUrl || '' }}
                    style={styles.restaurantImage}
                    fadeDuration={300}
                /> */}
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text> {/* Changed to restaurantName */}
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
        if (!restaurants.length) {
            return (
                <View style={styles.noRestaurantsContainer}>
                    <View style={StyleSheet.absoluteFillObject}>
                        <RestaurantsOnMap
                            restaurants={[]}
                            setLatitudeDelta={0.01}
                            setLongitudeDelta={0.01}
                            coverEntireScreen={true}
                        />
                    </View>
                    <View style={styles.blurOverlay}/>
                    <View style={styles.messageBox}>
                        <Text style={styles.noRestaurantsTitle}>Sorry!</Text>
                        <Text style={styles.noRestaurantsMessage}>
                            We are currently not operating in this area. Check back soon as we expand our services!
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <>
                <RestaurantsOnMap
                    restaurants={restaurants}
                    setLatitudeDelta={0.01}
                    setLongitudeDelta={0.01}
                    coverEntireScreen={true}
                />
                {/*<RestaurantsBottomSheet>*/}
                {/*    <>*/}
                {/*        <Text style={styles.sectionTitle}>Restaurants in Area</Text>*/}
                {/*        <FlatList*/}
                {/*            data={restaurants}*/}
                {/*            renderItem={renderRestaurantItem}*/}
                {/*            keyExtractor={(item) => item.id}*/}
                {/*            showsVerticalScrollIndicator={false}*/}
                {/*            contentContainerStyle={styles.listContainer}*/}
                {/*        />*/}
                {/*    </>*/}
                {/*</RestaurantsBottomSheet>*/}
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
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white overlay
        backdropFilter: 'blur(10px)', // Blurring effect
    },
    messageBox: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        alignItems: 'center',
    },
    noRestaurantsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6347', // Tomato red for a friendly alert
        marginBottom: 8,
    },
    noRestaurantsMessage: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
    },
    noRestaurantsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },

});

export default HomeMapView;
