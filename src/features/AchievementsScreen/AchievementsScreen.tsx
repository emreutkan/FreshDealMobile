import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Animated, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {LinearGradient} from 'expo-linear-gradient';
import {RootState} from '@/src/types/store';
import {AppDispatch} from '@/src/redux/store';
import {fetchUserAchievementsThunk} from '@/src/redux/thunks/achievementThunks';
import {Achievement} from '@/src/types/states';


const ACHIEVEMENT_ICONS: { [key: string]: string } = {
    'FIRST_PURCHASE': 'trophy',
    'PURCHASE_COUNT': 'basket',
    'WEEKLY_PURCHASE': 'calendar',
    'STREAK': 'flame',
    'BIG_SPENDER': 'cash',
    'ECO_WARRIOR': 'leaf',
    'DEFAULT': 'ribbon',
};


const AchievementCard: React.FC<{ achievement: Achievement, index: number }> = ({achievement, index}) => {
    const isUnlocked = achievement.earned_at !== undefined && achievement.earned_at !== null;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, []);

    const iconName = ACHIEVEMENT_ICONS[achievement.achievement_type] || ACHIEVEMENT_ICONS.DEFAULT;
    return (
        <Animated.View style={[
            styles.achievementCard,
            {
                opacity: fadeAnim,
                transform: [{
                    translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                    })
                }]
            }
        ]}>
            <LinearGradient
                colors={isUnlocked
                    ? ['rgba(80, 112, 60, 0.1)', 'rgba(80, 112, 60, 0.15)']
                    : ['rgba(200, 200, 200, 0.05)', 'rgba(200, 200, 200, 0.1)']}
                style={styles.cardGradient}
            >
                <View style={[
                    styles.iconContainer,
                    isUnlocked ? styles.unlockedIconContainer : styles.lockedIconContainer
                ]}>
                    <Ionicons
                        name={iconName as any}
                        size={30}
                        color={isUnlocked ? '#50703C' : '#aaaaaa'}
                    />
                </View>

                <View style={styles.achievementInfo}>
                    <View style={styles.achievementHeader}>
                        <Text style={[
                            styles.achievementName,
                            isUnlocked ? styles.unlockedText : styles.lockedText
                        ]}>
                            {achievement.name}
                        </Text>

                        {isUnlocked ? (
                            <View style={styles.unlockedBadge}>
                                <Ionicons name="checkmark-circle" size={14} color="#50703C"/>
                                <Text style={styles.unlockedBadgeText}>Earned</Text>
                            </View>
                        ) : (
                            <Ionicons name="lock-closed" size={16} color="#aaaaaa"/>
                        )}
                    </View>

                    <Text style={[
                        styles.achievementDescription,
                        isUnlocked ? styles.unlockedDescText : styles.lockedDescText
                    ]}>
                        {achievement.description}
                    </Text>

                    {achievement.threshold && !isUnlocked && (
                        <View style={styles.thresholdContainer}>
                            <Text style={styles.thresholdText}>
                                Goal: {achievement.threshold}
                            </Text>
                        </View>
                    )}

                    {isUnlocked && achievement.earned_at && (
                        <Text style={styles.earnedDate}>
                            Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                        </Text>
                    )}
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const AchievementsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const {
        achievements = [],
        loading: achievementsLoading
    } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchUserAchievementsThunk());
    }, [dispatch]);

    // Use explicit type assertion for achievements array
    const sortedAchievements = [...(achievements as Achievement[])].sort((a, b) => {
        // Use optional chaining for safer property access
        const aUnlocked = a?.earned_at != null;
        const bUnlocked = b?.earned_at != null;

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    // Also use type assertion and optional chaining here
    const unlockedCount = (achievements as Achievement[]).filter(a => a?.earned_at != null).length;
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchUserAchievementsThunk())
            .finally(() => {
                setTimeout(() => setRefreshing(false), 500);
            });
    };

    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#333"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Achievements</Text>
                <View style={styles.headerRight}/>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{unlockedCount}</Text>
                    <Text style={styles.statLabel}>Unlocked</Text>
                </View>
                <View style={styles.statDivider}/>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{achievements.length - unlockedCount}</Text>
                    <Text style={styles.statLabel}>Locked</Text>
                </View>
                <View style={styles.statDivider}/>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                        {achievements.length > 0
                            ? Math.round((unlockedCount / achievements.length) * 100)
                            : 0}%
                    </Text>
                    <Text style={styles.statLabel}>Complete</Text>
                </View>
            </View>

            {achievementsLoading && achievements.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#50703C"/>
                    <Text style={styles.loadingText}>Loading achievements...</Text>
                </View>
            ) : (
                <FlatList
                    data={sortedAchievements}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item, index}) => (
                        <AchievementCard achievement={item} index={index}/>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="ribbon-outline" size={64} color="#CCCCCC"/>
                            <Text style={styles.emptyText}>No achievements found</Text>
                            <Text style={styles.emptySubtext}>
                                Complete tasks to earn achievements
                            </Text>
                        </View>
                    }
                />
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
    headerRight: {
        width: 40,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        padding: 16,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 8,
    },
    statValue: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: '#50703C',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    achievementCard: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardGradient: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    unlockedIconContainer: {
        backgroundColor: 'rgba(80, 112, 60, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(80, 112, 60, 0.3)',
    },
    lockedIconContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    achievementInfo: {
        flex: 1,
    },
    achievementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    achievementName: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    unlockedText: {
        color: '#333',
    },
    lockedText: {
        color: '#999',
    },
    achievementDescription: {
        fontSize: 14,
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    unlockedDescText: {
        color: '#555',
    },
    lockedDescText: {
        color: '#999',
    },
    thresholdContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    thresholdText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Poppins-Medium',
    },
    earnedDate: {
        fontSize: 12,
        color: '#50703C',
        fontFamily: 'Poppins-Regular',
        marginTop: 4,
    },
    unlockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 112, 60, 0.15)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    unlockedBadgeText: {
        fontSize: 10,
        color: '#50703C',
        marginLeft: 2,
        fontFamily: 'Poppins-Medium',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#999',
        marginTop: 8,
    },
});

export default AchievementsScreen;