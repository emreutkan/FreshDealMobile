import React, {useCallback, useMemo, useRef} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {Restaurant} from '@/store/slices/restaurantSlice';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import RestaurantsOnMap from '@/src/features/homeScreen/components/RestaurantsOnMap';

const HomeMapView = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['15%', '50%', '70%'], []);
    const {restaurantsProximity} = useSelector(
        (state: RootState) => state.restaurant
    );

    const renderRestaurantItem = useCallback(
        ({item}: { item: Restaurant }) => (
            <View style={styles.restaurantCard}>
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
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

    const renderMapView = () => {
        if (!restaurantsProximity.length) {
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
                <View style={{
                    flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 0

                }}>
                    <RestaurantsOnMap
                        restaurants={restaurantsProximity}
                        setLatitudeDelta={0.01}
                        setLongitudeDelta={0.01}
                        coverEntireScreen={true}
                    />
                </View>
                <BottomSheet

                    ref={bottomSheetRef}
                    index={1}
                    style={{
                        zIndex: 3
                    }} // Ensure it stays above the map
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    handleIndicatorStyle={styles.bottomSheetHandle}
                    key={restaurantsProximity.length} // Force re-render
                >
                    <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                        <FlatList
                            data={restaurantsProximity}
                            renderItem={renderRestaurantItem}
                            keyExtractor={(item) => item.id}
                            ListHeaderComponent={() => (
                                <View>
                                    <Text style={styles.sectionTitle}>Restaurants in Area</Text>
                                </View>
                            )}
                            showsVerticalScrollIndicator={false}
                        />

                    </BottomSheetScrollView>
                </BottomSheet>
            </>
        );
    };

    return <View style={styles.container}>{renderMapView()}</View>;
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
});

export default HomeMapView;
