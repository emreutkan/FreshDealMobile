import React, {useEffect} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from '@/src/types/store';
import {getRecommendationsThunk} from '@/src/redux/thunks/recommendationThunks';
import {useHandleRestaurantPress} from '@/src/hooks/handleRestaurantPress';
import {Restaurant} from '@/src/types/api/restaurant/model';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.35;
const CARD_MARGIN = 12;
const CARD_HEIGHT = 130;

const Recommendations: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const handleRestaurantPress = useHandleRestaurantPress();
    const {
        showClosedRestaurants,
        showDelivery,
        showPickup,
        selectedCategory
    } = useSelector((state: RootState) => state.globalFilters);

    // Get recommendations data from Redux store
    const {recommendationIds, loading, error, status} = useSelector(
        (state: RootState) => state.recommendation
    );

    const {restaurantsProximity} = useSelector(
        (state: RootState) => state.restaurant
    );

    // Added isRestaurantOpen function
    const isRestaurantOpen = (workingDays: string[], workingHoursStart?: string, workingHoursEnd?: string): boolean => {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', {weekday: 'long'});
        if (!workingDays.includes(currentDay)) return false;
        if (workingHoursStart && workingHoursEnd) {
            const [startHour, startMinute] = workingHoursStart.split(':').map(Number);
            const [endHour, endMinute] = workingHoursEnd.split(':').map(Number);
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinute;
            const startTime = startHour * 60 + startMinute;
            const endTime = endHour * 60 + endMinute;
            // Handle overnight case (e.g. 22:00 - 02:00)
            if (endTime < startTime) {
                return currentTime >= startTime || currentTime <= endTime;
            }
            return currentTime >= startTime && currentTime <= endTime;
        }
        return true; // If no specific hours, assume open during working days
    };

    // Added isRestaurantAvailable function
    const isRestaurantAvailable = (restaurant: Restaurant): boolean => {
        return isRestaurantOpen(restaurant.workingDays, restaurant.workingHoursStart, restaurant.workingHoursEnd)
            && restaurant.listings > 0;
    };

    // Find restaurants in proximity data that match recommendation IDs
    const recommendedRestaurants = restaurantsProximity.filter(restaurant =>
        recommendationIds.includes(restaurant.id)
    );

    // Apply all global filters
    const filteredRestaurants = recommendedRestaurants.filter(restaurant => {
        const isAvailable = isRestaurantAvailable(restaurant);
        // Filter closed restaurants if setting is off
        if (!showClosedRestaurants && !isAvailable) {
            return false;
        }

        // Apply delivery/pickup filters
        if (!showDelivery && !showPickup) {
            // If neither option is selected, show all (shouldn't happen but just in case)
        } else if (showDelivery && !showPickup) {
            // Only show restaurants with delivery
            if (!restaurant.delivery) return false;
        } else if (!showDelivery && showPickup) {
            // Only show restaurants with pickup
            if (!restaurant.pickup) return false;
        } else {
            // Both options selected - show restaurants with either delivery OR pickup
            if (!restaurant.delivery && !restaurant.pickup) return false;
        }

        // Apply category filter
        if (selectedCategory !== 'all' && selectedCategory !== 'All Categories' && restaurant.category !== selectedCategory) {
            return false;
        }

        return true;
    });

    // Fetch recommendations when component mounts
    useEffect(() => {
        dispatch(getRecommendationsThunk());
    }, [dispatch]);

    // Don't show anything if we're still loading or if there are no recommendations
    if (loading || status === 'loading') {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <MaterialCommunityIcons name="star-circle" size={20} color="#50703C"/>
                        <Text style={styles.headerTitle}>Recommended For You</Text>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#50703C"/>
                    <Text style={styles.loadingText}>Finding recommendations for you...</Text>
                </View>
            </View>
        );
    }

    // Don't show anything if there are no recommendations
    if (error || status === 'failed' || !filteredRestaurants || filteredRestaurants.length === 0) { // Use filteredRestaurants
        return null;
    }

    const renderRecommendedItem = ({item}: { item: Restaurant }) => {
        const isAvailable = isRestaurantAvailable(item); // Added availability check

        return (
            <TouchableOpacity
                onPress={() => isAvailable && handleRestaurantPress(item.id, item)} // Conditionally press
                activeOpacity={0.8}
                style={styles.cardTouchable}
            >
                <View style={[styles.card, !isAvailable && styles.unavailableCard]}> {/* Added unavailableCard style */}
                    <View style={styles.imageContainer}>
                        {item.image_url ? (
                            <>
                                <Image source={{uri: item.image_url}} style={styles.image}/>
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.gradient}
                                />
                            </>
                        ) : (
                            <View style={styles.noImageContainer}>
                                <MaterialCommunityIcons name="food" size={24} color="#999"/>
                            </View>
                        )}

                        {/* Added unavailable overlay */}
                        {!isAvailable && (
                            <View style={styles.unavailableOverlay}>
                                <MaterialCommunityIcons name="clock-outline" size={20} color="#fff"/>
                                <Text style={styles.unavailableText}>
                                    {!isRestaurantOpen(item.workingDays, item.workingHoursStart, item.workingHoursEnd)
                                        ? 'Closed'
                                        : 'No Stock'}
                                </Text>
                            </View>
                        )}

                        <View style={styles.contentContainer}>
                            <View style={styles.badge}>
                                <MaterialCommunityIcons name="star" size={14} color="#fff"/>
                                <Text style={styles.badgeText}>Recommended</Text>
                            </View>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.restaurantName}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <MaterialCommunityIcons name="star-circle" size={20} color="#50703C"/>
                    <Text style={styles.headerTitle}>Recommended For You</Text>
                </View>
                <View style={styles.headerRight}>
                    {/*<TouchableOpacity onPress={debugState} style={styles.debugButton}>*/}
                    {/*    <Text style={styles.debugText}>State</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity onPress={debugRecommendations} style={styles.debugButton}>*/}
                    {/*    <Text style={styles.debugText}>API</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<Ionicons name="chevron-forward" size={20} color="#50703C"/>*/}
                </View>
            </View>

            <FlatList
                data={filteredRestaurants} // Use filteredRestaurants
                renderItem={renderRecommendedItem}
                keyExtractor={(item) => `recommended-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + CARD_MARGIN}
                snapToAlignment="start"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 8,
        marginBottom: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'Poppins-SemiBold',
    },
    debugButton: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    debugText: {
        fontSize: 12,
        color: '#50703C',
        fontFamily: 'Poppins-Medium',
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#50703C',
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
    },
    listContainer: {
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    cardTouchable: {
        width: CARD_WIDTH,
        marginRight: CARD_MARGIN,
    },
    card: {
        height: CARD_HEIGHT,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    unavailableCard: {
        opacity: 0.9,
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    noImageContainer: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    unavailableOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    unavailableText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    contentContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(80,112,60,0.8)',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 4,
        gap: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
});

export default Recommendations;

