import React, {useEffect, useState} from 'react';
import {Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/src/redux/store";
import {fetchUserAchievementsThunk} from "@/src/redux/thunks/achievementThunks";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {LinearGradient} from 'expo-linear-gradient';
import {Achievement} from "@/src/types/achievementTypes";

interface AchievementsSectionProps {
    achievements: Achievement[];
    onViewAchievements: () => void;
}

const ACHIEVEMENT_ICONS: { [key: string]: string } = {
    'FIRST_PURCHASE': 'trophy',
    'PURCHASE_COUNT': 'basket',
    'WEEKLY_PURCHASE': 'calendar',
    'STREAK': 'flame',
    'BIG_SPENDER': 'cash',
    'ECO_WARRIOR': 'leaf',
    'DEFAULT': 'ribbon',
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AchievementItem: React.FC<{
    achievement: Achievement;
    index: number;
    totalAchievements: number;
}> = ({achievement, index, totalAchievements}) => {
    const iconName = ACHIEVEMENT_ICONS[achievement.achievement_type] || ACHIEVEMENT_ICONS.DEFAULT;
    const isUnlocked = !!achievement.earned_at;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            delay: index * 150,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.achievementBadge,
                {
                    opacity: fadeAnim,
                    transform: [{
                        translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0]
                        })
                    }]
                }
            ]}
        >
            <LinearGradient
                colors={isUnlocked
                    ? ['rgba(80, 112, 60, 0.1)', 'rgba(80, 112, 60, 0.2)']
                    : ['rgba(200, 200, 200, 0.1)', 'rgba(200, 200, 200, 0.2)']}
                style={styles.badgeBackground}
            >
                <View style={[
                    styles.badgeIconContainer,
                    isUnlocked ? styles.unlockedIconContainer : styles.lockedIconContainer
                ]}>
                    <Ionicons
                        name={iconName as any}
                        size={26}
                        color={isUnlocked ? '#50703C' : '#aaaaaa'}
                    />
                </View>

                <Text style={[
                    styles.achievementName,
                    isUnlocked ? styles.unlockedText : styles.lockedText
                ]}>
                    {achievement.name}
                </Text>

                {achievement.threshold && !isUnlocked && (
                    <Text style={styles.thresholdText}>
                        Goal: {achievement.threshold}
                    </Text>
                )}

                {isUnlocked && (
                    <View style={styles.unlockedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#50703C"/>
                        <Text style={styles.unlockedBadgeText}>Earned</Text>
                    </View>
                )}

                {!isUnlocked && (
                    <View style={styles.lockedIconWrapper}>
                        <Ionicons name="lock-closed" size={14} color="#aaaaaa"/>
                    </View>
                )}
            </LinearGradient>
        </Animated.View>
    );
};

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
                                                                     achievements,
                                                                     onViewAchievements,
                                                                 }) => {
    const [hasDispatchedFetch, setHasDispatchedFetch] = useState(false);

    console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: Component rendering with",
        achievements?.length || 0, "achievements", "hasDispatchedFetch:", hasDispatchedFetch);

    if (achievements?.length) {
        console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: First few achievements:",
            JSON.stringify(achievements.slice(0, 2), null, 2));
    }

    const sortedAchievements = [...(achievements || [])].sort((a, b) => {
        const aUnlocked = !!a.earned_at;
        const bUnlocked = !!b.earned_at;

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: Sorted achievements - Unlocked count:",
        sortedAchievements.filter(a => !!a.earned_at).length);

    const unlockedCount = sortedAchievements.filter(a => !!a.earned_at).length;
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!hasDispatchedFetch) {
            console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: useEffect running, dispatching thunk");
            dispatch(fetchUserAchievementsThunk());
            setHasDispatchedFetch(true);
        }
    }, [dispatch, hasDispatchedFetch]);

    return (
        <View style={styles.achievementsSection}>
            <View style={styles.sectionHeader}>
                <View style={styles.headerLeftSection}>
                    <Ionicons name="ribbon-outline" size={20} color="#50703C"/>
                    <Text style={styles.sectionTitle}>Achievements</Text>

                    <View style={styles.achievementCountContainer}>
                        <Text style={styles.achievementCount}>
                            {unlockedCount}/{achievements.length}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={onViewAchievements}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="chevron-forward" size={16} color="#50703C"/>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.achievementsScroll}
                contentContainerStyle={styles.scrollContent}
            >
                {sortedAchievements.map((achievement, index) => (
                    <AchievementItem
                        key={achievement.id}
                        achievement={achievement}
                        index={index}
                        totalAchievements={achievements.length}
                    />
                ))}

                {sortedAchievements.length === 0 && (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="ribbon-outline" size={36} color="#CCCCCC"/>
                        <Text style={styles.emptyStateText}>No achievements yet</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    achievementsSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginLeft: 8,
    },
    achievementCountContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 10,
    },
    achievementCount: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 112, 60, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    viewAllText: {
        color: '#50703C',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginRight: 4,
    },
    achievementsScroll: {
        marginTop: 8,
    },
    scrollContent: {
        paddingRight: 20,
        paddingBottom: 8,
    },
    achievementBadge: {
        width: 130,
        height: 160,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    badgeBackground: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
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
    achievementName: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 6,
    },
    unlockedText: {
        color: '#333',
    },
    lockedText: {
        color: '#999',
    },
    thresholdText: {
        fontSize: 12,
        color: '#777',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    unlockedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
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
    lockedIconWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    emptyStateContainer: {
        width: 200,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#999',
        marginTop: 12,
        fontFamily: 'Poppins-Regular',
    },
});

export default AchievementsSection;