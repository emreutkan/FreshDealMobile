// screens/HomeMapView.tsx
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/redux/store';
import {Restaurant} from '@/src/types/api/restaurant/model';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import RestaurantsOnMap from '@/src/features/homeScreen/components/RestaurantsOnMap';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/utils/navigation';
import {getRestaurantsByProximity} from "@/src/redux/thunks/restaurantThunks";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;

const HomeMapView: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['15%', '50%', '70%'], []);
    const {restaurantsProximity} = useSelector((state: RootState) => state.restaurant);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isPullingBeyondMax, setIsPullingBeyondMax] = useState(false);
    const isAtMaxHeight = useRef(false);

    const [refreshing, setRefreshing] = useState(false);
    const [currentSheetIndex, setCurrentSheetIndex] = useState(1);
    const lastIndexRef = useRef(1);
    const onRefresh = useCallback(async () => {
        if (refreshing) return; // Prevent multiple refreshes

        setRefreshing(true);
        try {
            // Add your data refresh logic here
            // For example:
            await dispatch(getRestaurantsByProximity());

            // Optional: Add a slight delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Optional: Show success feedback
            // You might want to add a toast or other visual feedback here
        } catch (error) {
            console.error('Error refreshing restaurants:', error);
            // Optional: Show error feedback
        } finally {
            setRefreshing(false);
        }
    }, [refreshing]);

    // Render each restaurant item as a clickable card.
    const renderRestaurantItem = useCallback(
        ({item}: { item: Restaurant }) => (
            <TouchableOpacity
                onPress={() => navigation.navigate('RestaurantDetails', {restaurantId: item.id})}
                activeOpacity={0.8}
                style={styles.restaurantCard}
            >


                <Image
                    source={{
                        uri: item.image_url
                            ? item.image_url.replace('127.0.0.1', '192.168.1.3')
                            : 'https://via.placeholder.com/100',
                    }}
                    style={styles.restaurantImage}
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoadEnd={() => setIsImageLoading(false)}
                />
                {isImageLoading && (
                    <View style={[styles.restaurantImage, styles.imagePlaceholder]}>
                        <ActivityIndicator color="#999"/>
                    </View>
                )}
                {/** Right: Details */}
                <View style={styles.restaurantDetailsContainer}>
                    <Text style={styles.restaurantName}>
                        {item.restaurantName || 'Unnamed Restaurant'}
                    </Text>
                    <View style={styles.detailsRow}>
                        <View style={styles.ratingContainer}>
                            {item.rating && (
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
                    index={3}
                    style={styles.bottomSheet}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    handleIndicatorStyle={styles.bottomSheetHandle}
                    onChange={(index) => {
                        if (index === 3 && lastIndexRef.current !== 2) {  // 2 is the index of '70%' (maximum height)
                            onRefresh();
                        }
                        lastIndexRef.current = index;
                        setCurrentSheetIndex(index);
                    }}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                        {currentSheetIndex === 1 && ( // When at 50%
                            <View style={styles.pullHint}>
                                <Text style={styles.pullHintText}>Pull up to refresh</Text>
                                <Ionicons name="arrow-up" size={16} color="#666"/>
                            </View>
                        )}
                        {refreshing && (
                            <View style={styles.refreshIndicator}>
                                <ActivityIndicator size="small" color="#666"/>
                                <Text style={styles.refreshText}>Refreshing...</Text>
                            </View>
                        )}
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor="#666" // Add a color for the refresh indicator
                                    colors={['#666']} // For Android
                                />
                            }
                            data={restaurantsProximity}
                            renderItem={renderRestaurantItem}
                            keyExtractor={(item) => item.id.toString()}
                            ListHeaderComponent={() => (
                                <View style={styles.headerContainer}>
                                    <Text style={styles.sectionTitle}>Restaurants in Area</Text>
                                    <Text style={styles.restaurantCount}>
                                        {restaurantsProximity.length} restaurants found
                                    </Text>
                                </View>
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.flatListContent}
                            ItemSeparatorComponent={() => <View style={styles.separator}/>}
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
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 8,
        color: '#1a1a1a',
        letterSpacing: 0.3,
        paddingHorizontal: 4,
        fontFamily: 'Poppins-SemiBold',
        alignSelf: 'center',
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
        // marginBottom: 12,
        borderRadius: 12,
        borderColor: 'rgb(178,247,165)',
        overflow: 'hidden',
        elevation: 2,
        padding: 12, // Increased padding
        shadowColor: '#000', // iOS shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
    },
    restaurantImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#f0f0f0', // Placeholder background
    },
    restaurantDetailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    restaurantName: {
        fontFamily: 'Poppins-SemiBold',

        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1a1a1a',
        letterSpacing: 0.3,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 6,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFB800',
        marginRight: 4,
        fontFamily: 'Poppins-Regular',

    },
    voteCountText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 2,
        fontFamily: 'Poppins-Regular',

    },
    iconContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        padding: 6,
        borderRadius: 8,
    },
    icon: {
        marginLeft: 8,
        color: '#4A4A4A',
    },
    noRestaurantsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    messageBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        alignItems: 'center'
    },
    noRestaurantsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF5A5F',
        marginBottom: 12,
        letterSpacing: 0.5,
        fontFamily: 'Poppins-Regular',

    },
    noRestaurantsMessage: {
        fontFamily: 'Poppins-Regular',

        fontSize: 16,
        color: '#484848',
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.3,
    },
    bottomSheetContent: {
        paddingHorizontal: 16,
    },
    bottomSheetHandle: {
        backgroundColor: '#e0e0e0',
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 12,
    },
    headerContainer: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    restaurantCount: {
        fontFamily: 'Poppins-Regular',
        alignSelf: 'center',
        fontSize: 14,
        color: '#666',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    separator: {
        height: 12, // Space between restaurant cards
    },
    imagePlaceholder: {
        position: 'absolute',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    refreshIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        marginBottom: 12,
    },
    refreshText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',

    },
    pullHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        opacity: 0.6,
    },
    pullHintText: {
        fontSize: 12,
        color: '#666',
        marginRight: 4,
        fontFamily: 'Poppins-Regular',
    },
});
