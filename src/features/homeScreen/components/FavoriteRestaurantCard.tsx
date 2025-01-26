import React from "react";
import {Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/types/store";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {AppDispatch} from "@/src/redux/store";
import {useHandleRestaurantPress} from "@/src/hooks/handleRestaurantPress";

const {width} = Dimensions.get('window');
const FAVORITE_CARD_WIDTH = width * 0.50; // Increased for better visibility
const FAVORITE_CARD_MARGIN = 8;
const CARD_HEIGHT = 160; // Increased height for better proportions
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;

interface FavoriteRestaurantListProps {
    restaurants: Restaurant[];
}

const FavoriteRestaurantList: React.FC<FavoriteRestaurantListProps> = ({
                                                                           restaurants,
                                                                       }) => {
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const favoriteRestaurants = restaurants.filter(restaurant =>
        favoriteRestaurantsIDs.includes(restaurant.id)
    );
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();

    const handleRestaurantPress = useHandleRestaurantPress();

    const isRestaurantOpen = (
        workingDays: string[],
        workingHoursStart?: string,
        workingHoursEnd?: string
    ): boolean => {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', {weekday: 'long'});
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (!workingDays.includes(currentDay)) return false;

        if (workingHoursStart && workingHoursEnd) {
            const [startHour, startMinute] = workingHoursStart.split(':').map(Number);
            const [endHour, endMinute] = workingHoursEnd.split(':').map(Number);

            const currentTime = currentHour * 60 + currentMinute;
            const startTime = startHour * 60 + startMinute;
            const endTime = endHour * 60 + endMinute;

            return currentTime >= startTime && currentTime <= endTime;
        }

        return true;
    };

    const isRestaurantAvailable = (restaurant: Restaurant): boolean => {
        const isOpen = isRestaurantOpen(
            restaurant.workingDays,
            restaurant.workingHoursStart,
            restaurant.workingHoursEnd
        );
        const hasStock = restaurant.listings > 0;
        return isOpen && hasStock;
    };


    const renderFavoriteItem = ({item, index}: { item: Restaurant; index: number }) => {
        const inputRange = [
            (index - 1) * (FAVORITE_CARD_WIDTH + FAVORITE_CARD_MARGIN * 2),
            index * (FAVORITE_CARD_WIDTH + FAVORITE_CARD_MARGIN * 2),
            (index + 1) * (FAVORITE_CARD_WIDTH + FAVORITE_CARD_MARGIN * 2),
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
        });

        const isAvailable = isRestaurantAvailable(item);

        return (
            <Animated.View
                style={[
                    styles.favoriteTouchableContainer,
                    {transform: [{scale}], opacity}
                ]}
            >
                <TouchableOpacity
                    onPress={() => isAvailable && handleRestaurantPress(item.id)}
                    activeOpacity={isAvailable ? 0.95 : 1}
                    style={[styles.favoriteCard, !isAvailable && styles.unavailableCard]}
                >
                    <View style={styles.favoriteImageContainer}>
                        {item.image_url ? (
                            <>
                                <Image
                                    source={{
                                        uri: item.image_url
                                    }}
                                    style={[
                                        styles.favoriteImage,
                                        !isAvailable && styles.unavailableImage
                                    ]}
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={styles.gradient}
                                />
                            </>
                        ) : (
                            <View style={styles.favoriteNoImageContainer}>
                                <MaterialCommunityIcons
                                    name="food-fork-drink"
                                    size={40}
                                    color={isAvailable ? "#999" : "#ccc"}
                                />
                            </View>
                        )}

                        {!isAvailable && (
                            <View style={styles.unavailableOverlay}>
                                <Text style={styles.unavailableText}>
                                    {!isRestaurantOpen(
                                        item.workingDays,
                                        item.workingHoursStart,
                                        item.workingHoursEnd
                                    ) ? 'Currently Closed' : 'Out of Stock'}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.favoriteDetailsContainer}>
                        <Text style={[
                            styles.favoriteTitle,
                            !isAvailable && styles.unavailableTitle
                        ]} numberOfLines={1}>
                            {item.restaurantName || 'Unnamed Restaurant'}
                        </Text>
                        <View style={styles.favoriteRatingContainer}>
                            <MaterialCommunityIcons
                                name="star"
                                size={16}
                                color={isAvailable ? "#FFC107" : "#999"}
                            />
                            <Text style={[
                                styles.favoriteRating,
                                !isAvailable && styles.unavailableRating
                            ]}>
                                {(item.rating ?? 0).toFixed(1)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (favoriteRestaurants.length === 0) {
        return null;
    }

    return (
        <View style={styles.favoritesContainer}>
            <TouchableOpacity style={{
                padding: 16,
                backgroundColor: '#FFFFFF',

                flexDirection: 'row',

                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
            }}
                              onPress={() => navigation.navigate('FavoritesScreen')}
            >
                <Text style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: 4,
                    fontFamily: 'Poppins-Regular',

                }}>Favorites </Text>
                <Ionicons name={"chevron-forward-outline"} size={18} color="#50703C"/>
            </TouchableOpacity>


            <Animated.FlatList
                data={favoriteRestaurants}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => `favorite-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.favoriteListContainer}
                snapToInterval={FAVORITE_CARD_WIDTH + FAVORITE_CARD_MARGIN * 2}
                decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
                snapToAlignment="center"
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: true}
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    favoritesContainer: {
        // marginVertical: 16,
    },
    favoriteListContainer: {
        paddingHorizontal: 0,
        paddingVertical: 8,
    },
    favoriteTouchableContainer: {
        width: FAVORITE_CARD_WIDTH,
        marginHorizontal: FAVORITE_CARD_MARGIN,
    },
    favoriteCard: {
        height: CARD_HEIGHT,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    favoriteImageContainer: {
        height: '100%',
        position: 'relative',
    },
    favoriteImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
    },
    favoriteNoImageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteDetailsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    favoriteTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
        fontFamily: 'Poppins-Bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 3,
    },
    favoriteRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    favoriteRating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        marginLeft: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    unavailableCard: {
        opacity: 0.7,
    },
    unavailableImage: {
        opacity: 0.7,
    },
    unavailableOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unavailableText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        paddingHorizontal: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 3,
    },
    unavailableTitle: {
        color: '#cccccc',
    },
    unavailableRating: {
        color: '#999999',
    },
});

export default FavoriteRestaurantList;