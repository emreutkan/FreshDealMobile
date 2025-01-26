import React, {useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from "@/src/types/store";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {Ionicons} from "@expo/vector-icons";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {lightHaptic} from "@/src/utils/Haptics";

type RestaurantCommentsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'RestaurantComments'
>;

interface RestaurantCommentsProps {
    navigation: RestaurantCommentsScreenNavigationProp;
}

interface Comment {
    id: number;
    user_id: number;
    comment: string;
    rating: number;
    timestamp: string;
}

const CommentCard: React.FC<{ comment: Comment }> = ({comment}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={20} color="#666666"/>
                    </View>
                    <Text style={styles.userName}>User {comment.user_id}</Text>
                </View>
                <Text style={styles.commentDate}>{formatDate(comment.timestamp)}</Text>
            </View>

            <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                    <Ionicons
                        key={index}
                        name={index < comment.rating ? "star" : "star-outline"}
                        size={16}
                        color="#FFD700"
                        style={{marginRight: 2}}
                    />
                ))}
                <Text style={styles.ratingText}>{comment.rating.toFixed(1)}</Text>
            </View>

            <Text style={styles.commentText}>{comment.comment}</Text>
        </View>
    );
};

const RestaurantComments: React.FC<RestaurantCommentsProps> = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const restaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
    const comments = restaurant.comments || [];
    const onRefresh = React.useCallback(() => {
        lightHaptic();
        setRefreshing(true);
        console.log('Comments:', comments);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    return (
        <View style={styles.container}>
            <View style={[styles.header, {paddingTop: insets.top}]}>
                <GoBackIcon/>
                <Text style={styles.headerTitle}>{restaurant.restaurantName} Reviews</Text>
                <View style={styles.headerRight}/>
            </View>

            <View style={styles.ratingOverview}>
                <View style={styles.ratingMain}>
                    <Text style={styles.ratingNumber}>
                        {(restaurant?.rating ?? 0).toFixed(1)}
                    </Text>
                    <View style={styles.starsContainer}>
                        {[...Array(5)].map((_, index) => (
                            <Ionicons
                                key={index}
                                name={index < (restaurant?.rating ?? 0) ? "star" : "star-outline"}
                                size={20}
                                color="#FFD700"
                                style={{marginRight: 2}}
                            />
                        ))}
                    </View>
                    <Text style={styles.ratingCount}>
                        {restaurant?.ratingCount ?? 0} reviews
                    </Text>
                </View>
            </View>

            <FlatList
                data={comments}
                renderItem={({item}) => <CommentCard comment={item}/>}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#50703C']}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbox-outline" size={48} color="#666"/>
                        <Text style={styles.emptyText}>No reviews yet</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginLeft: -24,
        fontFamily: 'Poppins-Regular',
    },
    headerRight: {
        width: 24,
    },
    ratingOverview: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 8,
    },
    ratingMain: {
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: '#333',
        fontFamily: 'Poppins-Bold',
    },
    starsContainer: {
        flexDirection: 'row',
        marginVertical: 8,
        alignItems: 'center',
    },
    ratingCount: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    listContainer: {
        padding: 16,
    },
    commentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    commentDate: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    commentText: {
        color: '#333',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        marginTop: 8,
        color: '#666',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default RestaurantComments;