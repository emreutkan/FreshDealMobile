import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "@/src/types/store";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {Ionicons} from "@expo/vector-icons";
import {lightHaptic} from "@/src/utils/Haptics";
import {getRestaurantCommentAnalysisThunk} from '@/src/redux/thunks/restaurantThunks';

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

const CommentAnalysisCard: React.FC<{
    aspectType: 'good' | 'bad',
    aspects: string[],
    title: string,
    iconName: string
}> = ({aspectType, aspects, title, iconName}) => {
    if (!aspects || aspects.length === 0) return null;

    return (
        <View style={[styles.analysisCard, aspectType === 'good' ? styles.goodAspectsCard : styles.badAspectsCard]}>
            <View style={styles.aspectsHeader}>
                <Ionicons
                    name={iconName}
                    size={24}
                    color={aspectType === 'good' ? '#50703C' : '#D32F2F'}
                />
                <Text style={[styles.aspectsTitle, aspectType === 'good' ? styles.goodTitle : styles.badTitle]}>
                    {title}
                </Text>
            </View>
            <View style={styles.aspectsList}>
                {aspects.map((aspect, index) => (
                    <View key={index} style={styles.aspectItem}>
                        <Ionicons
                            name={aspectType === 'good' ? 'checkmark-circle' : 'alert-circle'}
                            size={16}
                            color={aspectType === 'good' ? '#50703C' : '#D32F2F'}
                            style={styles.aspectIcon}
                        />
                        <Text style={styles.aspectText}>{aspect}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const RestaurantComments: React.FC = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [showCommentsView, setShowCommentsView] = useState(true); // Toggle between comments and analysis

    const restaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
    const {commentAnalysis, commentAnalysisLoading, commentAnalysisError} = useSelector(
        (state: RootState) => state.restaurant
    );
    const comments = restaurant.comments || [];

    // Fetch comment analysis when component mounts
    useEffect(() => {
        if (restaurant.id && !commentAnalysis) {
            dispatch(getRestaurantCommentAnalysisThunk(restaurant.id));
        }
    }, [restaurant.id, dispatch]);

    const onRefresh = React.useCallback(() => {
        lightHaptic();
        setRefreshing(true);

        if (restaurant.id) {
            dispatch(getRestaurantCommentAnalysisThunk(restaurant.id))
                .finally(() => setRefreshing(false));
        } else {
            setRefreshing(false);
        }
    }, [restaurant.id, dispatch]);

    const toggleView = () => {
        lightHaptic();
        setShowCommentsView(!showCommentsView);
    };

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

                <View style={styles.viewToggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            showCommentsView ? styles.activeToggle : styles.inactiveToggle
                        ]}
                        onPress={() => setShowCommentsView(true)}
                    >
                        <Text style={showCommentsView ? styles.activeToggleText : styles.inactiveToggleText}>
                            All Comments
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            !showCommentsView ? styles.activeToggle : styles.inactiveToggle
                        ]}
                        onPress={() => setShowCommentsView(false)}
                    >
                        <Text style={!showCommentsView ? styles.activeToggleText : styles.inactiveToggleText}>
                            AI Analysis
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showCommentsView ? (
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
            ) : (
                <View style={styles.analysisContainer}>
                    {commentAnalysisLoading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Analyzing restaurant comments...</Text>
                        </View>
                    ) : commentAnalysisError ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={48} color="#D32F2F"/>
                            <Text style={styles.errorText}>{commentAnalysisError}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => {
                                    if (restaurant.id) {
                                        dispatch(getRestaurantCommentAnalysisThunk(restaurant.id));
                                    }
                                }}
                            >
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : !commentAnalysis ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="analytics-outline" size={48} color="#666"/>
                            <Text style={styles.emptyText}>No analysis available</Text>
                        </View>
                    ) : (
                        <FlatList
                            contentContainerStyle={styles.analysisListContainer}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#50703C']}
                                />
                            }
                            data={[1]} // Dummy data to make FlatList work
                            renderItem={() => (
                                <>
                                    {commentAnalysis.comment_count > 0 ? (
                                        <View style={styles.analysisInfoContainer}>
                                            <Text style={styles.analysisInfoText}>
                                                Analysis based on {commentAnalysis.comment_count} comments
                                            </Text>
                                            <Text style={styles.analysisDateText}>
                                                Analyzed
                                                on {new Date(commentAnalysis.analysis_date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.analysisInfoContainer}>
                                            <Text style={styles.analysisInfoText}>
                                                Not enough comments for a detailed analysis
                                            </Text>
                                        </View>
                                    )}

                                    <CommentAnalysisCard
                                        aspectType="good"
                                        aspects={commentAnalysis.good_aspects}
                                        title="What customers like"
                                        iconName="thumbs-up"
                                    />

                                    <CommentAnalysisCard
                                        aspectType="bad"
                                        aspects={commentAnalysis.bad_aspects}
                                        title="Areas for improvement"
                                        iconName="thumbs-down"
                                    />
                                </>
                            )}
                            keyExtractor={() => "analysis"}
                        />
                    )}
                </View>
            )}
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
    viewToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 2,
        marginTop: 8,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeToggle: {
        backgroundColor: '#50703C',
    },
    inactiveToggle: {
        backgroundColor: 'transparent',
    },
    activeToggleText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    inactiveToggleText: {
        color: '#666666',
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
    // Analysis styles
    analysisContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    analysisListContainer: {
        padding: 16,
    },
    analysisInfoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    analysisInfoText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    analysisDateText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
        marginTop: 4,
    },
    analysisCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    goodAspectsCard: {
        backgroundColor: '#F1F8E9',
        borderLeftWidth: 4,
        borderLeftColor: '#50703C',
    },
    badAspectsCard: {
        backgroundColor: '#FFEBEE',
        borderLeftWidth: 4,
        borderLeftColor: '#D32F2F',
    },
    aspectsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    aspectsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        fontFamily: 'Poppins-Regular',
    },
    goodTitle: {
        color: '#50703C',
    },
    badTitle: {
        color: '#D32F2F',
    },
    aspectsList: {
        marginLeft: 8,
    },
    aspectItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    aspectIcon: {
        marginTop: 2,
        marginRight: 8,
    },
    aspectText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#D32F2F',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
        fontFamily: 'Poppins-Regular',
    },
    retryButton: {
        backgroundColor: '#50703C',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
});

export default RestaurantComments;