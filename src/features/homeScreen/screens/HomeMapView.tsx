// screens/HomeMapView.tsx
import React, {useCallback, useMemo, useRef} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/redux/store';
import {Restaurant} from '@/src/redux/slices/restaurantSlice';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import RestaurantsOnMap from '@/src/features/homeScreen/components/RestaurantsOnMap';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/utils/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;

const HomeMapView: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['15%', '50%', '70%'], []);
    const {restaurantsProximity} = useSelector((state: RootState) => state.restaurant);

    // Render each restaurant item as a clickable card.
    const renderRestaurantItem = useCallback(
        ({item}: { item: Restaurant }) => (
            <TouchableOpacity
                onPress={() => navigation.navigate('RestaurantDetails', {restaurantId: item.id})}
                activeOpacity={0.8}
                style={styles.restaurantCard}
            >
                {/** Left: Image */}
                <Image
                    source={{
                        uri: item.image_url
                            ? item.image_url.replace('127.0.0.1', '192.168.1.3')
                            : 'https://via.placeholder.com/100',
                    }}
                    style={styles.restaurantImage}
                />
                {/** Right: Details */}
                <View style={styles.restaurantDetailsContainer}>
                    <Text style={styles.restaurantName}>
                        {item.restaurantName || 'Unnamed Restaurant'}
                    </Text>
                    <View style={styles.detailsRow}>
                        <View style={styles.ratingContainer}>
                            {item.rating !== undefined && (
                                <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
                            )}
                            <Text style={styles.voteCountText}>({item.ratingCount ?? 0})</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            {item.pickup && (
                                <Ionicons name="walk-outline" size={20} color="#333" style={styles.icon}/>
                            )}
                            {item.delivery && (
                                <Ionicons name="bicycle-outline" size={20} color="#333" style={styles.icon}/>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        ),
        [navigation]
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
                <View style={styles.mapContainer}>
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
                    style={styles.bottomSheet}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    handleIndicatorStyle={styles.bottomSheetHandle}
                    key={restaurantsProximity.length} // Force re-render when length changes
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

export default HomeMapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mapContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    bottomSheet: {
        zIndex: 3,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        padding: 8,
    },
    restaurantImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    restaurantDetailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#333',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFD700',
        marginRight: 4,
    },
    voteCountText: {
        fontSize: 12,
        color: '#666',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 8,
    },
    noRestaurantsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
        color: '#FF6347',
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
