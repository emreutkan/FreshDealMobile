import React from "react";
import {Alert, Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/types/store";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useHandleRestaurantPress} from "@/src/hooks/handleRestaurantPress";
import {getFavoritesThunk} from "@/src/redux/thunks/userThunks";

const {width} = Dimensions.get('window');
const FAVORITE_CARD_WIDTH = width * 0.35;
const FAVORITE_CARD_MARGIN = 8;
const CARD_HEIGHT = 130;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;

interface FavoriteRestaurantListProps {
    restaurants: Restaurant[];
}

const FavoriteRestaurantList: React.FC<FavoriteRestaurantListProps> = ({restaurants}) => {
    const dispatch = useDispatch();
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const favoriteRestaurants = restaurants.filter(restaurant => favoriteRestaurantsIDs.includes(restaurant.id));
    const navigation = useNavigation<NavigationProp>();
    const handleRestaurantPress = useHandleRestaurantPress();

    const debugFavorites = async () => {
        try {
            const response = dispatch(getFavoritesThunk());
            Alert.alert('Debug Info', `Favorites Response:\n${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            Alert.alert('Debug Error', `Error:\n${JSON.stringify(error, null, 2)}`);
        }
    };

    const debugState = () => {
        Alert.alert('Debug Info', `Current State:\nFavorites: ${JSON.stringify(favoriteRestaurantsIDs)}\nRestaurants: ${JSON.stringify(favoriteRestaurants.map(r => r.restaurantName))}`);
    };

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
            return currentTime >= startTime && currentTime <= endTime;
        }
        return true;
    };

    const isRestaurantAvailable = (restaurant: Restaurant): boolean => {
        return isRestaurantOpen(restaurant.workingDays, restaurant.workingHoursStart, restaurant.workingHoursEnd)
            && restaurant.listings > 0;
    };

    const renderFavoriteItem = ({item, index}: { item: Restaurant; index: number }) => {
        const isAvailable = isRestaurantAvailable(item);

        return (
            <TouchableOpacity
                onPress={() => isAvailable && handleRestaurantPress(item.id)}
                activeOpacity={0.8}
                style={styles.favoriteTouchableContainer}
            >
                <View style={[styles.favoriteCard, !isAvailable && styles.unavailableCard]}>
                    <View style={styles.favoriteImageContainer}>
                        {item.image_url ? (
                            <>
                                <Image source={{uri: item.image_url}} style={styles.favoriteImage}/>
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.gradient}
                                />
                            </>
                        ) : (
                            <View style={styles.favoriteNoImageContainer}>
                                <MaterialCommunityIcons name="food" size={24} color="#999"/>
                            </View>
                        )}

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

                        <View style={styles.favoriteContentContainer}>
                            <View style={styles.ratingBadge}>
                                <MaterialCommunityIcons name="star" size={14} color="#FFD700"/>
                                <Text style={styles.ratingText}>{(item.rating ?? 0).toFixed(1)}</Text>
                            </View>
                            <Text style={styles.favoriteTitle} numberOfLines={2}>
                                {item.restaurantName}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (favoriteRestaurants.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <MaterialCommunityIcons name="heart" size={20} color="#50703C"/>
                    <Text style={styles.headerTitle}>Favorites</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={debugState} style={styles.debugButton}>
                        <Text style={styles.debugText}>State</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={debugFavorites} style={styles.debugButton}>
                        <Text style={styles.debugText}>API</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('FavoritesScreen')}>
                        <Ionicons name="chevron-forward" size={20} color="#50703C"/>
                    </TouchableOpacity>
                </View>
            </View>

            <Animated.FlatList
                data={favoriteRestaurants}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => `favorite-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                decelerationRate="fast"
                snapToInterval={FAVORITE_CARD_WIDTH + FAVORITE_CARD_MARGIN}
                snapToAlignment="start"
                onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: true})}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 8,
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
    listContainer: {
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    favoriteTouchableContainer: {
        width: FAVORITE_CARD_WIDTH,
        marginRight: FAVORITE_CARD_MARGIN,
    },
    favoriteCard: {
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
    favoriteImageContainer: {
        flex: 1,
        position: 'relative',
    },
    favoriteImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favoriteNoImageContainer: {
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
    favoriteContentContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 4,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 2,
        fontFamily: 'Poppins-SemiBold',
    },
    favoriteTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
    },
    unavailableCard: {
        opacity: 0.9,
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
});

export default FavoriteRestaurantList;