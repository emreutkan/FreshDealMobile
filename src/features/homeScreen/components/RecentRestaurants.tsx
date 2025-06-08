import React from "react";
import {Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/src/types/store";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import {useHandleRestaurantPress} from "@/src/hooks/handleRestaurantPress";
import {Restaurant} from "@/src/types/api/restaurant/model";

const {width} = Dimensions.get('window');
const RECENT_CARD_WIDTH = width * 0.35;
const RECENT_CARD_MARGIN = 8;
const CARD_HEIGHT = 130;

const RecentRestaurants = () => {
    const {recentRestaurantIDs, recentRestaurantsLoading, restaurantsProximity} = useSelector(
        (state: RootState) => state.restaurant
    );
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const handleRestaurantPress = useHandleRestaurantPress();

    const recentRestaurants = restaurantsProximity.filter(restaurant =>
        recentRestaurantIDs.includes(restaurant.id)
    );

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
            if (endTime < startTime) {
                return currentTime >= startTime || currentTime <= endTime;
            }
            return currentTime >= startTime && currentTime <= endTime;
        }
        return true;
    };

    const isRestaurantAvailable = (restaurant: Restaurant): boolean => {
        return isRestaurantOpen(restaurant.workingDays, restaurant.workingHoursStart, restaurant.workingHoursEnd)
            && restaurant.listings > 0;
    };

    if (recentRestaurantsLoading || !recentRestaurants || recentRestaurants.length === 0) {
        return null;
    }

    const renderRecentItem = ({item}: { item: Restaurant; index: number }) => {
        const isAvailable = isRestaurantAvailable(item);

        return (
            <TouchableOpacity
                onPress={() => isAvailable && handleRestaurantPress(item.id, item)}
                activeOpacity={0.8}
                style={styles.recentTouchableContainer}
            >
                <View style={[styles.recentCard, !isAvailable && styles.unavailableCard]}>
                    <View style={styles.recentImageContainer}>
                        {item.image_url ? (
                            <>
                                <Image source={{uri: item.image_url}} style={styles.recentImage}/>
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.gradient}
                                />
                            </>
                        ) : (
                            <View style={styles.recentNoImageContainer}>
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

                        <View style={styles.recentContentContainer}>
                            <View style={styles.dateBadge}>
                                <MaterialCommunityIcons name="clock-outline" size={14} color="#fff"/>
                                <Text style={styles.dateText}>Recent</Text>
                            </View>
                            <Text style={styles.recentTitle} numberOfLines={2}>
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
                    <MaterialCommunityIcons name="history" size={20} color="#50703C"/>
                    <Text style={styles.headerTitle}>Recent Orders</Text>
                </View>
            </View>

            <Animated.FlatList
                data={recentRestaurants}
                renderItem={renderRecentItem}
                keyExtractor={(item) => `recent-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                decelerationRate="fast"
                snapToInterval={RECENT_CARD_WIDTH + RECENT_CARD_MARGIN}
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
    recentTouchableContainer: {
        width: RECENT_CARD_WIDTH,
        marginRight: RECENT_CARD_MARGIN,
    },
    recentCard: {
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
    recentImageContainer: {
        flex: 1,
        position: 'relative',
    },
    recentImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    recentNoImageContainer: {
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
    recentContentContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 8,
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 4,
        gap: 4,
    },
    dateText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    recentTitle: {
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

export default RecentRestaurants;

