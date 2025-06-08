import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import RestaurantList from "@/src/features/homeScreen/components/RestaurantCard";
import {Feather} from '@expo/vector-icons';
import {AppDispatch} from "@/src/redux/store";
import {RootState} from "@/src/types/store";
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from "react-redux";
import {getRecentRestaurantsThunk, getRestaurantsByProximity} from "@/src/redux/thunks/restaurantThunks";
import FavoriteRestaurantList from "@/src/features/homeScreen/components/FavoriteRestaurantCard";
import Slider from '@react-native-community/slider';
import {setRadius} from "@/src/redux/slices/restaurantSlice";
import {lightHaptic, strongHaptic} from "@/src/utils/Haptics";
import {Purchase} from "@/src/types/api/purchase/model";
import RecentOrderToast from "@/src/features/OrdersScreen/RenderOrdersToast";
import RecentRestaurants from "@/src/features/homeScreen/components/RecentRestaurants";
import FlashDealsBottomSheet from "@/src/features/FlashDeals/FlashDealsBottomSheet";
import Recommendations from "@/src/features/homeScreen/components/Recommendations";
import {getRecommendationsThunk} from '@/src/redux/thunks/recommendationThunks';
import {
    setSelectedCategory,
    setShowClosedRestaurants,
    setShowDelivery,
    setShowPickup
} from '@/src/redux/slices/globalFiltersSlice';
import {Restaurant} from "@/src/types/api/restaurant/model";

interface HomeCardViewProps {
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const MIN_LOADING_DURATION = 0;
const FILTER_LOADING_DURATION = 0;

const CATEGORIES = [
    "All Categories",
    "Baked Goods",
    "Fruits & Vegetables",
    "Meat & Seafood",
    "Dairy Products",
    "Ready Meals",
    "Snacks",
    "Beverages",
    "Pantry Items",
    "Frozen Foods",
    "Organic Products"
];

const HomeCardView: React.FC<HomeCardViewProps> = ({onScroll}) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const HEADER_MAX_HEIGHT = 130;
    const HEADER_MIN_HEIGHT = 0;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });
    const [refreshing, setRefreshing] = useState(false);

    // Flash deals state
    const [isFlashDealsVisible, setIsFlashDealsVisible] = useState(false);

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0.9],
        extrapolate: 'clamp',
    });
    const {restaurantsProximity, restaurantsProximityLoading, restaurantsProximityStatus} = useSelector(
        (state: RootState) => state.restaurant
    );

    const [showMainLoading, setShowMainLoading] = useState(restaurantsProximityLoading);

    const dispatch = useDispatch<AppDispatch>();
    const [filterLoading, setFilterLoading] = useState(false);
    const reduxRadius = useSelector((state: RootState) => state.restaurant.radius);
    const [localRadius, setLocalRadius] = useState(reduxRadius);

    const {showClosedRestaurants, showDelivery, showPickup, selectedCategory: globalSelectedCategory} = useSelector(
        (state: RootState) => state.globalFilters
    );

    const [shownPurchaseIds, setShownPurchaseIds] = useState<number[]>([]);
    const lastCreatedPurchases = useSelector((state: RootState) => state.purchase.lastCreatedPurchases);
    const [latestOrder, setLatestOrder] = useState<Purchase | null>(null);

    // Category state
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const [under30Filter, setUnder30Filter] = useState(false);

    // Define helper functions before they are used in useMemo
    const isRestaurantOpen = useCallback((workingDays: string[], workingHoursStart?: string, workingHoursEnd?: string): boolean => {
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
            if (endTime < startTime) { // Handles overnight
                return currentTime >= startTime || currentTime <= endTime;
            }
            return currentTime >= startTime && currentTime <= endTime;
        }
        return true;
    }, []);

    const isRestaurantAvailable = useCallback((restaurant: Restaurant): boolean => {
        return isRestaurantOpen(restaurant.workingDays, restaurant.workingHoursStart, restaurant.workingHoursEnd)
            && restaurant.listings > 0;
    }, [isRestaurantOpen]);

    // Reset scrollY when component mounts
    useEffect(() => {
        const resetScrollPosition = () => {
            scrollY.setValue(0);
        };

        // Reset when component mounts
        resetScrollPosition();

        return () => {
            // Reset when component unmounts to prevent stale values
            resetScrollPosition();
        };
    }, []);

    // Trigger minimal scroll when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            // Add minimal scroll to trigger component reload
            setTimeout(() => {
                if (scrollViewRef.current) {
                    // First scroll a small distance up
                    scrollViewRef.current.scrollTo({y: 5, animated: true});

                    // Then scroll back down slightly after a delay
                    setTimeout(() => {
                        if (scrollViewRef.current) {
                            scrollViewRef.current.scrollTo({y: 0, animated: true});
                        }
                    }, 0);
                }
            }, 0);
        }, [])
    );

    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                onScroll(event);
            }
        }
    );

    // Show flash deals when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFlashDealsVisible(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (lastCreatedPurchases && lastCreatedPurchases.length > 0) {
            const newPurchases = lastCreatedPurchases.filter(
                purchase => !shownPurchaseIds.includes(purchase.purchase_id)
            );

            if (newPurchases.length > 0) {
                const latestPurchase = newPurchases[0];
                setLatestOrder(latestPurchase);
                setShownPurchaseIds(prev => [...prev, latestPurchase.purchase_id]);

                setTimeout(() => {
                    setShownPurchaseIds(prev =>
                        prev.filter(id => id !== latestPurchase.purchase_id)
                    );
                }, 6000);
            }
        }
    }, [lastCreatedPurchases]);

    useEffect(() => {
        lightHaptic().then(r => console.log(r));
    }, [localRadius]);

    useEffect(() => {
        let timer: number;
        if (restaurantsProximityLoading) {
            setShowMainLoading(true);
        } else {
            timer = setTimeout(() => {
                setShowMainLoading(false);
            }, MIN_LOADING_DURATION);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [restaurantsProximityLoading]);

    const onRefresh = useCallback(() => {
        strongHaptic().then(r => console.log(r));
        setRefreshing(true);
        Promise.all([
            dispatch(getRestaurantsByProximity()),
            dispatch(getRecommendationsThunk())
        ]).finally(() => {
            setRefreshing(false);
        });
    }, [dispatch]);

    useEffect(() => {
        strongHaptic().then(r => console.log(r));
        dispatch(getRestaurantsByProximity());
        dispatch(getRecentRestaurantsThunk());
        dispatch(getRecommendationsThunk());
    }, [dispatch, reduxRadius]);

    const isLoading = showMainLoading || filterLoading;

    const triggerFilterLoading = () => {
        setFilterLoading(true);
        setTimeout(() => {
            setFilterLoading(false);
        }, FILTER_LOADING_DURATION);
    };

    const handleToggleUnder30Filter = () => {
        triggerFilterLoading();
        setUnder30Filter(prev => !prev);
    };

    const toggleCategoryModal = () => {
        setIsCategoryModalVisible(!isCategoryModalVisible);
    };

    const filteredRestaurants = useMemo(() => {
        if (!restaurantsProximity) return [];

        return restaurantsProximity.filter((restaurant) => {
            const isAvailable = isRestaurantAvailable(restaurant);
            // Global filter: Show/Hide Closed Restaurants
            if (!showClosedRestaurants && !isAvailable) return false;

            // Global filter: Delivery/Pickup
            // Only show restaurants that match at least one of the selected options
            if (!showDelivery && !showPickup) {
                // If neither option is selected, show all restaurants (no filtering)
                // This prevents having no results when both are toggled off
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

            // Local filter: "under 30 min" (based on distance_km)
            if (under30Filter && (restaurant.distance_km ? restaurant.distance_km > 3 : true)) return false;

            // Global filter: Category
            if (globalSelectedCategory !== "all" && globalSelectedCategory !== "All Categories" && restaurant.category !== globalSelectedCategory) {
                return false;
            }

            return true;
        });
    }, [restaurantsProximity, showClosedRestaurants, showDelivery, showPickup, globalSelectedCategory, under30Filter, isRestaurantAvailable]);

    const renderCategoryItem = ({item}: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                globalSelectedCategory === item && styles.categoryItemSelected,
            ]}
            onPress={() => dispatch(setSelectedCategory(item))}
        >
            <Text
                style={[
                    styles.categoryItemText,
                    globalSelectedCategory === item && styles.categoryItemTextSelected,
                ]}
            >
                {item}
            </Text>
            {globalSelectedCategory === item && (
                <Feather name="check" size={18} color="#50703C"/>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.safeArea}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent/>

            <Animated.View
                style={[
                    styles.headerContainer,
                    {
                        height: headerHeight,
                        opacity: headerOpacity,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                    }
                ]}
            >
                <View style={styles.topBar}>
                    <Text style={styles.title}>Restaurants Near You</Text>
                </View>

                <ScrollView
                    horizontal
                    style={styles.filterBar}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContentContainer}
                >
                    <TouchableOpacity style={styles.iconButton} onPress={toggleCategoryModal}>
                        <Feather name="sliders" size={16} color="#333"/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            showPickup && styles.filterButtonSelected,
                        ]}
                        onPress={() => {
                            // If pickup is currently on and we're toggling it off, make sure delivery is on
                            if (showPickup && !showDelivery) {
                                dispatch(setShowDelivery(true));
                            }
                            dispatch(setShowPickup(!showPickup));
                        }}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                showPickup && styles.filterTextSelected,
                            ]}
                        >
                            Pick Up
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            showDelivery && styles.filterButtonSelected,
                        ]}
                        onPress={() => {
                            // If delivery is currently on and we're toggling it off, make sure pickup is on
                            if (showDelivery && !showPickup) {
                                dispatch(setShowPickup(true));
                            }
                            dispatch(setShowDelivery(!showDelivery));
                        }}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                showDelivery && styles.filterTextSelected,
                            ]}
                        >
                            Delivery
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            globalSelectedCategory !== "all" && styles.filterButtonSelected,
                        ]}
                        onPress={toggleCategoryModal}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                globalSelectedCategory !== "all" && styles.filterTextSelected,
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {globalSelectedCategory === 'all' ? 'All Categories' : globalSelectedCategory.charAt(0).toUpperCase() + globalSelectedCategory.slice(1)}
                        </Text>
                        <Feather
                            name={isCategoryModalVisible ? 'chevron-up' : 'chevron-down'}
                            size={14}
                            color={globalSelectedCategory !== "all" ? '#FFF' : '#333'}
                            style={styles.dropdownIcon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            under30Filter && styles.filterButtonSelected,
                        ]}
                        onPress={handleToggleUnder30Filter}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                under30Filter && styles.filterTextSelected,
                            ]}
                        >
                            Under 30 min
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            showClosedRestaurants && styles.filterButtonSelected,
                        ]}
                        onPress={() => dispatch(setShowClosedRestaurants(!showClosedRestaurants))}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                showClosedRestaurants && styles.filterTextSelected,
                            ]}
                        >
                            {showClosedRestaurants ? "Showing Closed" : "Hiding Closed"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>

            <Modal
                visible={isCategoryModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsCategoryModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsCategoryModalVisible(false)}
                >
                    <View style={styles.categoryModal}>
                        <View style={styles.categoryModalHeader}>
                            <Text style={styles.categoryModalTitle}>Select Category</Text>
                            <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
                                <Feather name="x" size={24} color="#333"/>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={CATEGORIES}
                            keyExtractor={(item) => item}
                            renderItem={renderCategoryItem}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <View style={styles.container}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#50703C"/>
                        <Text style={styles.loadingText}>Finding the best restaurants...</Text>
                    </View>
                ) : restaurantsProximityStatus !== 'succeeded' || filteredRestaurants.length === 0 ? (
                    <View style={styles.noDataContainer}>
                        <View style={styles.noDataIconContainer}>
                            <Feather name="coffee" size={48} color="#50703C"/>
                        </View>
                        <Text style={styles.noDataTitle}>No Restaurants Found</Text>
                        <Text style={styles.noDataMessage}>
                            Try adjusting your filters or expanding your search area
                        </Text>
                    </View>
                ) : (
                    <Animated.ScrollView
                        ref={scrollViewRef}

                        style={styles.scrollContainer}
                        contentContainerStyle={{
                            paddingTop: HEADER_MAX_HEIGHT,
                            paddingBottom: 20,
                            flexGrow: 1,
                        }}
                        onScroll={handleScroll}

                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#50703C"
                                colors={['#50703C']}
                                progressViewOffset={HEADER_MAX_HEIGHT}
                            />
                        }
                    >
                        <View>
                            {latestOrder && (
                                <RecentOrderToast
                                    order={latestOrder}
                                    onDismiss={() => setLatestOrder(null)}
                                />
                            )}
                        </View>

                        {/* Add the Recommendations component right above RecentRestaurants */}
                        <Recommendations/>

                        <RecentRestaurants/>

                        <View style={styles.radiusContainer}>
                            <Text style={styles.radiusText}>Search Radius: {localRadius}km</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={100}
                                step={1}
                                value={localRadius}
                                onValueChange={(value) => setLocalRadius(Math.round(value))}
                                onSlidingComplete={(value) => {
                                    const roundedValue = Math.round(value);
                                    setLocalRadius(roundedValue);
                                    dispatch(setRadius(roundedValue));
                                }}
                                minimumTrackTintColor="#50703C"
                                maximumTrackTintColor="#E5E7EB"
                                thumbTintColor="#50703C"
                            />
                        </View>


                        <FavoriteRestaurantList
                            restaurants={filteredRestaurants}
                        />


                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Explore</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <RestaurantList
                            restaurants={filteredRestaurants}
                        />
                    </Animated.ScrollView>
                )}
            </View>

            {/* Flash Deals Bottom Sheet */}
            <FlashDealsBottomSheet
                isVisible={isFlashDealsVisible}
                onClose={() => setIsFlashDealsVisible(false)}
                onFloatingBadgePress={() => setIsFlashDealsVisible(true)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 8,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 0,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 0,
            },
        }),
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        fontFamily: 'Poppins-Bold',
        letterSpacing: -0.5,
    },
    filterBar: {
        backgroundColor: '#FFFFFF',
        maxHeight: 60,
    },
    filterContainer: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 8,
    },
    filterContentContainer: {
        paddingTop: 6,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        borderWidth: 0,
    },
    filterButtonSelected: {
        backgroundColor: '#50703C',
        borderColor: '#50703C',
    },
    filterIcon: {
        marginRight: 6,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        fontFamily: 'Poppins-SemiBold',
    },
    filterTextSelected: {
        color: '#FFFFFF',
    },
    dropdownIcon: {
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    categoryModal: {
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '70%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    categoryModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    categoryModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Poppins-Bold',
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    categoryItemSelected: {
        backgroundColor: '#F3F4F6',
    },
    categoryItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        fontFamily: 'Poppins-Medium',
    },
    categoryItemTextSelected: {
        color: '#50703C',
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    topBar: {
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'hidden',
        borderBottomWidth: 0,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    noDataIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    noDataTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    noDataMessage: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Poppins-Regular',
    },
    radiusContainer: {
        marginTop: 4,
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    radiusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    slider: {
        height: 40,
        width: '100%',
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        fontFamily: 'Poppins-Bold',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#50703C',
        fontFamily: 'Poppins-SemiBold',
    }
});

export default HomeCardView;

