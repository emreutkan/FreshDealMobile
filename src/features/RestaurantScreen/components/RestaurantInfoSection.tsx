import React, {useContext, useEffect, useState} from "react";
import {
    Animated,
    FlatList,
    Image,
    LayoutChangeEvent,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import LocateToRestaurant from "@/src/features/RestaurantScreen/components/locateToRestaurant";
import {LinearGradient} from "expo-linear-gradient";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import PickUpDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/types/store";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {AppDispatch} from "@/src/redux/store";
import {getRestaurantBadgesThunk} from "@/src/redux/thunks/restaurantThunks";

// Import our context
import {ScrollContext} from "@/src/features/RestaurantScreen/RestaurantDetails";

// Enhanced badge icon mappings with both icon and color
const BADGE_INFO = {
    'fresh': {
        icon: 'food-apple',
        name: 'Fresh Ingredients',
        color: '#5CB85C',
        description: 'Uses fresh, locally sourced ingredients'
    },
    'fast_delivery': {
        icon: 'truck-fast',
        name: 'Fast Delivery',
        color: '#F0AD4E',
        description: 'Quick delivery times, usually under 30 minutes'
    },
    'customer_friendly': {
        icon: 'emoticon-happy-outline',
        name: 'Customer Friendly',
        color: '#5BC0DE',
        description: 'Known for exceptional customer service'
    },
    // Add more badges with descriptions
    'eco_friendly': {
        icon: 'leaf',
        name: 'Eco Friendly',
        color: '#50703C',
        description: 'Uses sustainable practices and eco-friendly packaging'
    },
    'best_value': {
        icon: 'currency-usd',
        name: 'Best Value',
        color: '#D9534F',
        description: 'Great quality food at competitive prices'
    }
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RestaurantInfoSection: React.FC = () => {
    const {scrollY, setHeaderHeight} = useContext(ScrollContext);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

    const restaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
    const badges = useSelector((state: RootState) => state.restaurant.selectedRestaurant.badges || []);

    useEffect(() => {
        if (restaurant?.id) {
            dispatch(getRestaurantBadgesThunk({
                restaurantId: Number(restaurant.id)
            }));
        }
    }, [restaurant?.id, dispatch]);

    // Measure the header height and set it in context
    const onLayout = (event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        if (setHeaderHeight && height > 0) {
            setHeaderHeight(height);
        }
    };

    // Calculate header translation based on scroll position
    const headerTranslate = scrollY.interpolate({
        inputRange: [0, 300],
        outputRange: [0, -300],
        extrapolate: 'clamp'
    });

    // Calculate title opacity for mini header
    const miniHeaderOpacity = scrollY.interpolate({
        inputRange: [100, 150],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    // Calculate main content opacity
    const contentOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    // Badge detail modal
    const BadgeDetailModal = () => {
        if (!selectedBadge) return null;

        const badgeInfo = BADGE_INFO[selectedBadge] || {
            icon: 'medal',
            name: selectedBadge,
            color: '#666666',
            description: 'No description available'
        };

        return (
            <Modal
                transparent
                visible={showBadgeModal}
                animationType="fade"
                onRequestClose={() => setShowBadgeModal(false)}
            >
                <View style={styles.badgeModalContainer}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        onPress={() => setShowBadgeModal(false)}
                    />
                    <View style={styles.badgeModalContent}>
                        <View style={[styles.badgeIconLarge, {backgroundColor: badgeInfo.color + '20'}]}>
                            <MaterialCommunityIcons
                                name={badgeInfo.icon}
                                size={40}
                                color={badgeInfo.color}
                            />
                        </View>
                        <Text style={styles.badgeModalTitle}>{badgeInfo.name}</Text>
                        <Text style={styles.badgeModalDescription}>{badgeInfo.description}</Text>

                        <TouchableOpacity
                            style={[styles.closeButtonSmall, {backgroundColor: badgeInfo.color}]}
                            onPress={() => setShowBadgeModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    // Information map modal remains the same
    const InformationMapModal = () => {
        // Your existing InformationMapModal code
        return (
            <Modal
                transparent
                visible={showInfoModal}
                animationType="slide"
                onRequestClose={() => setShowInfoModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        onPress={() => setShowInfoModal(false)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Restaurant Info</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowInfoModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            marginBottom: 20,
                        }}>
                            <Text style={styles.modalInfoText}>
                                {restaurant?.restaurantDescription || "No info available."}
                            </Text>
                            <Text style={styles.modalInfoText}>
                                <Text style={{fontFamily: "Poppins-SemiBold"}}>Category: </Text>
                                {restaurant?.category || "N/A"}
                            </Text>
                            <Text style={styles.modalInfoText}>
                                <Text style={{fontFamily: "Poppins-SemiBold"}}>Working Hours: </Text>
                                {formatWorkingHours(
                                    restaurant?.workingHoursStart || "",
                                    restaurant?.workingHoursEnd || ""
                                )}
                            </Text>
                            {restaurant?.delivery && (
                                <Text style={styles.modalInfoText}>
                                    <Text style={{fontFamily: "Poppins-SemiBold"}}>Delivery Fee: </Text>
                                    {`${restaurant?.deliveryFee || 0}\u20BA`}
                                </Text>
                            )}
                        </View>

                        <View style={styles.mapContainer}>
                            <LocateToRestaurant/>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    // Enhanced badges section with animation and interactivity
    const renderBadges = () => {
        if (!badges || badges.length === 0) {
            return null;
        }

        return (
            <View style={styles.badgesContainer}>
                <View style={styles.badgesTitleRow}>
                    <Text style={styles.cardTitle}>Badges</Text>
                    {badges.length > 3 && (
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={badges}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                        const badgeInfo = BADGE_INFO[item] || {
                            icon: 'medal',
                            name: item,
                            color: '#666666'
                        };

                        return (
                            <TouchableOpacity
                                style={[styles.badgeItem, {borderColor: badgeInfo.color}]}
                                onPress={() => {
                                    setSelectedBadge(item);
                                    setShowBadgeModal(true);
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.badgeIcon, {backgroundColor: badgeInfo.color + '20'}]}>
                                    <MaterialCommunityIcons
                                        name={badgeInfo.icon}
                                        size={24}
                                        color={badgeInfo.color}
                                    />
                                </View>
                                <Text style={[styles.badgeName, {color: badgeInfo.color}]}>
                                    {badgeInfo.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.badgesList}
                />
            </View>
        );
    };

    // helper functions for walking / driving times
    function getWalkingTime(distance_km: number) {
        // ~5 km/h => distance_km * 12 = minutes
        return Math.round(distance_km * 12);
    }

    function getDrivingTime(distance_km: number) {
        if (distance_km < 1.5) {
            return 1;
        }
        return Math.round(distance_km * 2);
    }

    const formatWorkingHours = (start: string, end: string) => {
        return `${start} - ${end}`;
    };

    return (
        <Animated.View
            style={[
                styles.container,
            ]}
            onLayout={onLayout}
        >
            {/* Mini Header - appears on scroll */}
            <Animated.View
                style={[
                    styles.miniHeader,
                    {
                        opacity: scrollY.interpolate({
                            inputRange: [50, 100],
                            outputRange: [0, 1],
                            extrapolate: 'clamp'
                        })
                    }
                ]}
            >
                <Text style={styles.miniTitle} numberOfLines={1}>
                    {restaurant?.restaurantName || "Restaurant"}
                </Text>
                <View style={styles.miniRating}>
                    <Ionicons name="star" size={16} color="#FFD700"/>
                    <Text style={styles.miniRatingText}>
                        {(restaurant?.rating ?? 0).toFixed(1)}
                    </Text>
                </View>
            </Animated.View>

            {/* Main Content - fades out on scroll */}
            <Animated.View style={{}}>
                <View style={styles.imageContainer}>
                    {restaurant?.image_url ? (
                        <>
                            <Image
                                source={{uri: restaurant.image_url}}
                                style={styles.restaurantImage}
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.7)']}
                                style={styles.imageOverlay}
                            />
                        </>
                    ) : (
                        <View style={styles.noImageContainer}>
                            <Ionicons
                                name="restaurant-outline"
                                size={48}
                                color="#CCCCCC"
                            />
                            <Text style={styles.noImageText}>
                                No image available
                            </Text>
                        </View>
                    )}
                    <GoBackIcon/>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.mainRestaurantTitle} numberOfLines={1}>
                            {restaurant?.restaurantName || "Restaurant"}
                        </Text>
                        <TouchableOpacity
                            style={styles.infoButton}
                            onPress={() => setShowInfoModal(true)}
                        >
                            <Ionicons name="information-circle-outline" size={24} color="#666666"/>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 16,
                        }}
                    >
                        <View style={styles.ratingContainer}>
                            <View style={styles.ratingBox}>
                                <Ionicons name="star" size={18} color="#FFD700"/>
                                <Text style={styles.ratingText}>
                                    {(restaurant?.rating ?? 0).toFixed(1)}
                                </Text>
                                <Text style={styles.ratingCount}>
                                    ({restaurant?.ratingCount ?? 0}+)
                                </Text>
                            </View>
                            <View style={styles.distanceBox}>
                                <Text style={styles.distanceText}>
                                    {(restaurant?.distance_km ?? 0).toFixed(1)} km
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.commentsButton}
                            onPress={() => navigation.navigate('RestaurantComments')}
                        >
                            <Ionicons name="chatbubble-outline" size={18} color="#666666"/>
                            <Text style={styles.commentsText}>Comments</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Badges Section */}
                    {renderBadges()}

                    <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Delivery Information</Text>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                            <View>
                                <View style={styles.timeRow}>
                                    <View style={styles.timeIcon}>
                                        <Ionicons name="walk-outline" size={20} color="#666666"/>
                                    </View>
                                    <Text style={styles.timeText}>
                                        {getWalkingTime(restaurant?.distance_km ?? 0)} min walking
                                    </Text>
                                </View>
                                <View style={styles.timeRow}>
                                    <View style={styles.timeIcon}>
                                        <Ionicons name="car-outline" size={20} color="#666666"/>
                                    </View>
                                    <Text style={styles.timeText}>
                                        {getDrivingTime(restaurant?.distance_km ?? 0)} min driving
                                    </Text>
                                </View>
                            </View>

                            <PickUpDeliveryToggle/>
                        </View>
                    </View>
                </View>
            </Animated.View>

            <InformationMapModal/>
            <BadgeDetailModal/>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    miniHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    miniTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#1A1A1A',
        flex: 1,
    },
    miniRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    miniRatingText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#1A1A1A',
        marginLeft: 4,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    noImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        marginTop: 8,
        color: '#666666',
        fontFamily: "Poppins-Regular",
    },
    contentContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    mainRestaurantTitle: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
    },
    infoButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    ratingText: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginLeft: 4,
    },
    ratingCount: {
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        color: '#666666',
        marginLeft: 4,
    },
    distanceBox: {
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
    },
    distanceText: {
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        color: '#666666',
    },
    commentsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    commentsText: {
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        color: '#666666',
        marginLeft: 6,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    // Enhanced Badge styles
    badgesContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    badgesTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAllText: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        color: '#50703C',
    },
    badgesList: {
        paddingVertical: 8,
    },
    badgeItem: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        borderWidth: 1,
        borderColor: '#50703C',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    badgeIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    badgeIconLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    badgeName: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        color: '#50703C',
        textAlign: 'center',
    },
    badgeModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    badgeModalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    badgeModalTitle: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 20,
        color: "#333",
        marginBottom: 12,
    },
    badgeModalDescription: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#666",
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    closeButtonSmall: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#50703C",
        marginTop: 12,
    },
    cardTitle: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
        paddingHorizontal: 2,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    timeText: {
        fontFamily: "Poppins-Regular",
        fontSize: 15,
        color: '#666666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalContent: {
        width: "100%",
        height: "85%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#333",
        fontFamily: "Poppins-Regular",
    },
    closeButton: {
        backgroundColor: "#333",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Poppins-Regular",
    },
    modalInfoText: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#333",
        marginBottom: 12,
        lineHeight: 24,
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        overflow: "hidden",
    },
});

export default RestaurantInfoSection;