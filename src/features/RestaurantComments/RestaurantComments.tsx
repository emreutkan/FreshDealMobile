import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "@/src/types/store";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {lightHaptic} from "@/src/utils/Haptics";
import {getRestaurantCommentAnalysisThunk, getRestaurantCommentsThunk} from '@/src/redux/thunks/restaurantThunks';
import {Comment} from '@/src/types/api/restaurant/model';
import {LinearGradient} from 'expo-linear-gradient';

const BadgeItem: React.FC<{ badge: { name: string, is_positive: boolean } }> = ({badge}) => {
    const badgeColor = badge.is_positive ? '#50703C' : '#D32F2F';
    const backgroundColor = badge.is_positive ? '#F0F9EB' : '#FFEBEE';
    const iconName = badge.is_positive ? "checkmark-circle" : "close-circle";

    const formatBadgeName = (name: string): string => {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <View style={[styles.badge, {backgroundColor}]}>
            <Ionicons name={iconName} size={14} color={badgeColor} style={{marginRight: 4}}/>
            <Text style={[styles.badgeText, {color: badgeColor}]}>
                {formatBadgeName(badge.name)}
            </Text>
        </View>
    );
};

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
                        <Ionicons name="person" size={20} color="#FFFFFF"/>
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

            {comment.badges && comment.badges.length > 0 && (
                <View style={styles.badgesContainer}>
                    {comment.badges.map((badge, index) => (
                        <BadgeItem key={`${comment.id}-badge-${index}`} badge={badge}/>
                    ))}
                </View>
            )}
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
    const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);

    const restaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
    const {
        commentAnalysis,
        commentAnalysisLoading,
        commentAnalysisError,
        comments,
        commentsLoading
    } = useSelector((state: RootState) => state.restaurant);

    useEffect(() => {
        if (restaurant.id) {
            dispatch(getRestaurantCommentsThunk(restaurant.id));
            dispatch(getRestaurantCommentAnalysisThunk(restaurant.id));
        }
    }, [restaurant.id, dispatch]);

    const onRefresh = React.useCallback(() => {
        lightHaptic();
        setRefreshing(true);

        if (restaurant.id) {
            Promise.all([
                dispatch(getRestaurantCommentsThunk(restaurant.id)),
                dispatch(getRestaurantCommentAnalysisThunk(restaurant.id))
            ]).finally(() => setRefreshing(false));
        } else {
            setRefreshing(false);
        }
    }, [restaurant.id, dispatch]);

    const toggleAnalysisDetails = () => {
        lightHaptic();
        setShowAnalysisDetails(!showAnalysisDetails);
    };

    const renderAnalysisSummary = () => {
        if (commentAnalysisLoading) {
            return (
                <View style={styles.analysisLoading}>
                    <ActivityIndicator size="small" color="#50703C"/>
                    <Text style={styles.analysisLoadingText}>Analyzing reviews...</Text>
                </View>
            );
        }

        if (commentAnalysisError) {
            return (
                <TouchableOpacity
                    style={styles.analysisError}
                    onPress={() => {
                        if (restaurant.id) {
                            dispatch(getRestaurantCommentAnalysisThunk(restaurant.id));
                        }
                    }}
                >
                    <Ionicons name="refresh" size={20} color="#D32F2F"/>
                    <Text style={styles.analysisErrorText}>Error loading analysis. Tap to retry.</Text>
                </TouchableOpacity>
            );
        }

        if (!commentAnalysis || commentAnalysis.comment_count === 0) {
            return (
                <View style={styles.analysisUnavailable}>
                    <MaterialIcons name="analytics-off" size={22} color="#757575"/>
                    <Text style={styles.analysisUnavailableText}>
                        Not enough reviews for analysis
                    </Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={styles.analysisSummary}
                onPress={toggleAnalysisDetails}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#F0F9EB', '#E8F5E9']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.analysisSummaryGradient}
                >
                    <View style={styles.analysisSummaryContent}>
                        <View style={styles.analysisSummaryIconContainer}>
                            <MaterialIcons name="analytics" size={24} color="#50703C"/>
                        </View>
                        <View style={styles.analysisSummaryTextContainer}>
                            <Text style={styles.analysisSummaryTitle}>AI Review Analysis</Text>
                            <Text style={styles.analysisSummarySubtitle}>
                                Based on {commentAnalysis.comment_count} reviews
                            </Text>
                        </View>
                        <Ionicons
                            name={showAnalysisDetails ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#50703C"
                            style={styles.chevronIcon}
                        />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, {paddingTop: insets.top}]}>
                <GoBackIcon/>
                <Text style={styles.headerTitle}>{restaurant.restaurantName} Reviews</Text>
                <View style={styles.headerRight}/>
            </View>

            <View style={styles.ratingOverviewContainer}>
                <LinearGradient
                    colors={['#50703C', '#3E5A2E']}
                    style={styles.ratingOverview}
                >
                    <View style={styles.ratingMain}>
                        <Text style={styles.ratingNumber}>
                            {(restaurant?.rating ?? 0).toFixed(1)}
                        </Text>
                        <View style={styles.starsContainer}>
                            {[...Array(5)].map((_, index) => (
                                <Ionicons
                                    key={index}
                                    name={index < (restaurant?.rating ?? 0) ? "star" : "star-outline"}
                                    size={22}
                                    color="#FFD700"
                                    style={{marginRight: 4}}
                                />
                            ))}
                        </View>
                        <Text style={styles.ratingCount}>
                            ({restaurant?.ratingCount ?? 0} reviews)
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            {renderAnalysisSummary()}

            {showAnalysisDetails && commentAnalysis && (
                <View style={styles.analysisDetailsContainer}>
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
                </View>
            )}

            <FlatList
                data={comments}
                renderItem={({item}) => <CommentCard comment={item}/>}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || commentsLoading}
                        onRefresh={onRefresh}
                        colors={['#50703C']}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="chatbox-outline" size={48} color="#CCCCCC"/>
                        </View>
                        <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                        <Text style={styles.emptyText}>Be the first to leave a review for this restaurant</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginLeft: -24,
        fontFamily: 'Poppins-Bold',
    },
    headerRight: {
        width: 24,
    },
    ratingOverviewContainer: {
        marginBottom: 16,
    },
    ratingOverview: {
        padding: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    ratingMain: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 16,

        borderRadius: 12,
        backgroundColor: '#50703C',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',

    },
    ratingNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Poppins-Bold',
    },
    starsContainer: {
        flexDirection: 'row',
        marginVertical: 8,
        alignItems: 'center',
    },
    ratingCount: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        marginTop: 4,
        opacity: 0.9,
    },
    analysisSummary: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    analysisSummaryGradient: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    analysisSummaryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    analysisSummaryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    analysisSummaryTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    analysisSummaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins-SemiBold',
    },
    analysisSummarySubtitle: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    chevronIcon: {
        marginLeft: 8,
    },
    analysisLoading: {
        backgroundColor: '#F9FAFB',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    analysisLoadingText: {
        color: '#666',
        fontFamily: 'Poppins-Regular',
        marginLeft: 8,
    },
    analysisError: {
        backgroundColor: '#FEF2F2',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    analysisErrorText: {
        color: '#D32F2F',
        fontFamily: 'Poppins-Regular',
        marginLeft: 8,
    },
    analysisUnavailable: {
        backgroundColor: '#F9FAFB',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    analysisUnavailableText: {
        color: '#666',
        fontFamily: 'Poppins-Regular',
        marginLeft: 8,
    },
    analysisDetailsContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 8,
    },
    listContainer: {
        padding: 16,
        paddingTop: 8,
    },
    commentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#50703C',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'Poppins-SemiBold',
    },
    commentDate: {
        color: '#6B7280',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    ratingText: {
        marginLeft: 8,
        color: '#4B5563',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    commentText: {
        color: '#374151',
        fontSize: 15,
        lineHeight: 22,
        fontFamily: 'Poppins-Regular',
        marginBottom: 16,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    emptyText: {
        color: '#6B7280',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        lineHeight: 22,
    },
    analysisCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
    },
    goodAspectsCard: {
        backgroundColor: '#F0F9EB',
        borderLeftWidth: 4,
        borderLeftColor: '#50703C',
    },
    badAspectsCard: {
        backgroundColor: '#FFEBEE',
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
    },
    aspectsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    aspectsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    goodTitle: {
        color: '#50703C',
    },
    badTitle: {
        color: '#DC2626',
    },
    aspectsList: {
        paddingLeft: 8,
    },
    aspectItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    aspectIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    aspectText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: '#374151',
        fontFamily: 'Poppins-Regular',
    },
});

export default RestaurantComments;