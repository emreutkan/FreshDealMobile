import React, {useCallback} from "react";
import {Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, store} from "@/src/redux/store";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
// Import the thunk actions
import {addFavoriteThunk, removeFavoriteThunk} from "@/src/redux/thunks/userThunks";

interface RestaurantListProps {
    restaurants: Restaurant[];
    onRestaurantPress: (restaurantId: string) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;
const {width} = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = width - (CARD_MARGIN * 4);
const RestaurantList: React.FC<RestaurantListProps> = ({restaurants, onRestaurantPress}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();

    // Access current favorite restaurant IDs from the store
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);

    const [pressedId, setPressedId] = React.useState<string | null>(null);

    const handleRestaurantPress = useCallback(
        (restaurantId: string) => {
            navigation.navigate('RestaurantDetails', {restaurantId});
        },
        [navigation]
    );

    const handleFavoritePress = useCallback(
        (id: string) => {
            const token = (store.getState() as RootState).user.token; // or use a selector if you prefer
            if (!token) {
                console.error('Authentication token is missing.');
                return;
            }
            // If it’s already a favorite, dispatch the remove thunk; otherwise, dispatch the add thunk.
            if (favoriteRestaurantsIDs.includes(id)) {
                // cast to int before dispatch
                dispatch(removeFavoriteThunk({restaurant_id: Number(id)}));
            } else {
                console.log('Adding favorite:', id);
                dispatch(addFavoriteThunk({restaurant_id: Number(id)}));
            }

        },
        [dispatch, favoriteRestaurantsIDs]
    );

    const renderRestaurantItem = ({item}: { item: Restaurant }) => {
        const isPressed = pressedId === item.id;
        const isFavorite = favoriteRestaurantsIDs.includes(item.id);

        return (
            <TouchableOpacity
                onPress={() => handleRestaurantPress(item.id)}
                onPressIn={() => setPressedId(item.id)}
                onPressOut={() => setPressedId(null)}
                activeOpacity={0.97}
                style={[styles.touchableContainer, isPressed && styles.touchablePressed]}
            >
                <View style={[styles.restaurantCard, isPressed && styles.cardPressed]}>
                    <View style={styles.imageContainer}>
                        {item.image_url ? (
                            <Image
                                source={{
                                    uri: item.image_url.replace('127.0.0.1', '192.168.1.3'),
                                }}
                                style={[styles.image, isPressed && styles.imagePressed]}
                            />
                        ) : (
                            <View style={styles.noImageContainer}>
                                <MaterialCommunityIcons name="food-fork-drink" size={40} color="#ccc"/>
                                <Text style={styles.noImageText}>No image available</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.heartButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleFavoritePress(item.id);
                            }}
                        >
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={isFavorite ? "#FF4081" : "#757575"}
                            />
                        </TouchableOpacity>

                        <View style={styles.badgeContainer}>
                            {item.delivery && (
                                <View style={styles.badge}>
                                    <Ionicons name={"bicycle-outline"} size={16} color={"#ffffff"}/>
                                    <Text style={styles.badgeText}>Delivery</Text>
                                </View>
                            )}
                            {item.pickup && (
                                <View style={[styles.badge, styles.pickupBadge]}>
                                    <MaterialCommunityIcons name="shopping-outline" size={14} color="#fff"/>
                                    <Text style={styles.badgeText}>Pickup</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.titleRow}>
                            <View style={styles.titleDistanceContainer}>
                                <Text style={styles.title} numberOfLines={1}>
                                    {item.restaurantName || 'Unnamed Restaurant'}
                                </Text>
                                <View style={styles.distanceContainer}>
                                    <MaterialCommunityIcons name="map-marker" size={14} color="#757575"/>
                                    <Text style={styles.distanceText}>
                                        {(item.distance_km ?? 0).toFixed(1)} km
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.ratingContainer}>
                                <MaterialCommunityIcons name="star" size={16} color="#FFC107"/>
                                <Text style={styles.rating}>{(item.rating ?? 0).toFixed(1)}</Text>
                                <Text style={styles.voteCount}>({item.ratingCount ?? 0})</Text>
                            </View>
                        </View>


                        <View
                            style={styles.infoRow}
                        >
                            {item.restaurantDescription && (
                                <Text style={styles.description} numberOfLines={2}>
                                    {item.restaurantDescription}
                                </Text>
                            )}
                            <View style={styles.footer}>


                                {item.minOrderAmount != null && (
                                    <View style={styles.minOrderContainer}>
                                        <Text style={styles.minOrderText}>
                                            Min. ${item.minOrderAmount.toFixed(2)}
                                        </Text>
                                    </View>
                                )}
                                {item.delivery && item.deliveryFee != null && (
                                    <View style={styles.deliveryFeeContainer}>
                                        <Text style={styles.deliveryFeeText}>
                                            delivery ${item.deliveryFee.toFixed(2)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={restaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: CARD_MARGIN,
        backgroundColor: "#f5f5f5",
    },
    touchableContainer: {
        marginBottom: 16,
        width: CARD_WIDTH,
        alignSelf: 'center',
    },
    touchablePressed: {
        transform: [{scale: 0.98}],
    },
    restaurantCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardPressed: {
        backgroundColor: "#fafafa",
    },
    imageContainer: {
        position: "relative",
        height: 200,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    noImageContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    noImageText: {
        color: "#999",
        marginTop: 8,
        fontSize: 14,
        fontFamily: "Poppins-Regular",

    },
    heartButton: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 8,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    badgeContainer: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    pickupBadge: {
        backgroundColor: '#2196F3',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: "Poppins-Regular",

    },
    detailsContainer: {
        padding: 16,
        gap: 8,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold',

    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: "600",
        color: "#212121",
        fontFamily: "Poppins-Regular",
    },
    voteCount: {
        fontSize: 12,
        color: "#757575",
        fontFamily: "Poppins-Regular",

    },
    infoRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',  // This will create maximum space between children

    },
    distance: {
        fontSize: 14,
        color: "#757575",
        fontFamily: "Poppins-Regular",

    },
    description: {
        fontSize: 14,
        color: "#616161",
        lineHeight: 20,
        fontFamily: "Poppins-Regular",
        paddingLeft: 1.5,

    },
    footer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    minOrderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    minOrderText: {
        fontSize: 13,
        color: "#757575",
        fontFamily: "Poppins-Regular",

    },
    deliveryFeeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deliveryFeeText: {
        fontSize: 13,
        color: "#757575",
        fontFamily: "Poppins-Regular",

    },
    titleDistanceContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingRight: 8,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    distanceText: {
        fontSize: 12,
        color: "#757575",
        fontFamily: "Poppins-Regular",
    },
});

export default RestaurantList;