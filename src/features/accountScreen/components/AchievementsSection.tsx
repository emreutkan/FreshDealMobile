import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/src/redux/store";
import {fetchUserAchievementsThunk} from "@/src/redux/thunks/achievementThunks";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";

export interface Achievement {
    id: number;
    name: string;
    achievement_type: string;
    badge_image_url: string;
    description: string;
    threshold?: number;
    earned_at?: string;
}

interface AchievementsSectionProps {
    achievements: Achievement[];
    onViewAchievements: () => void;
}

// Map of achievement types to icon names (Material Community Icons)
const ACHIEVEMENT_ICONS: { [key: string]: string } = {
    'FIRST_PURCHASE': 'trophy',
    'PURCHASE_COUNT': 'shopping',
    'WEEKLY_PURCHASE': 'calendar-week',
    'STREAK': 'fire',
    'BIG_SPENDER': 'cash',
    'ECO_WARRIOR': 'leaf',
    'DEFAULT': 'medal',
};
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
                                                                     achievements,
                                                                     onViewAchievements,
                                                                 }) => {
    // Track whether we've already dispatched the thunk
    const [hasDispatchedFetch, setHasDispatchedFetch] = useState(false);

    console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: Component rendering with",
        achievements?.length || 0, "achievements", "hasDispatchedFetch:", hasDispatchedFetch);

    if (achievements?.length) {
        console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: First few achievements:",
            JSON.stringify(achievements.slice(0, 2), null, 2));
    }

    // Sort achievements by unlocked status (unlocked first)
    const sortedAchievements = [...(achievements || [])].sort((a, b) => {
        // Determine unlocked status based on earned_at existence
        const aUnlocked = !!a.earned_at;
        const bUnlocked = !!b.earned_at;

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: Sorted achievements - Unlocked count:",
        sortedAchievements.filter(a => !!a.earned_at).length);

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
                <Text style={styles.sectionTitle}>Achievements</Text>
                <TouchableOpacity onPress={onViewAchievements}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
                {sortedAchievements.map((achievement) => {
                    // Get icon name from mapping or use default
                    const iconName = ACHIEVEMENT_ICONS[achievement.achievement_type] || ACHIEVEMENT_ICONS.DEFAULT;
                    const isUnlocked = !!achievement.earned_at;

                    console.log(`[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: Rendering achievement ${achievement.id} - ${achievement.name}, unlocked: ${isUnlocked}`);

                    return (
                        <View
                            key={achievement.id}
                            style={[
                                styles.achievementBadge,
                                !isUnlocked && styles.lockedAchievement
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={iconName as any}
                                size={24}
                                color={isUnlocked ? '#50703C' : '#aaaaaa'}
                            />
                            <Text style={[
                                styles.achievementName,
                                !isUnlocked && styles.lockedText
                            ]}>
                                {achievement.name}
                            </Text>

                            {achievement.threshold && (
                                <Text style={[
                                    styles.thresholdText,
                                    !isUnlocked && styles.lockedText
                                ]}>
                                    Required: {achievement.threshold}
                                </Text>
                            )}

                            {isUnlocked && achievement.earned_at && (
                                <Text style={styles.achievementDate}>
                                    {new Date(achievement.earned_at).toLocaleDateString()}
                                </Text>
                            )}

                            {!isUnlocked && (
                                <MaterialIcons
                                    name="lock"
                                    size={12}
                                    color="#aaaaaa"
                                    style={styles.lockIcon}
                                />
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    achievementsSection: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        paddingLeft: 4,
    },
    viewAllText: {
        color: '#50703C',
        fontSize: 14,
        fontWeight: '500',
    },
    achievementsScroll: {
        flexDirection: 'row',
    },
    achievementBadge: {
        width: 120,
        height: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    lockedAchievement: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
    },
    achievementName: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
    lockedText: {
        color: '#aaaaaa',
    },
    thresholdText: {
        fontSize: 10,
        color: '#555',
        textAlign: 'center',
        marginTop: 2,
    },
    achievementDate: {
        fontSize: 10,
        color: '#777',
        textAlign: 'center',
        marginTop: 4,
    },
    lockIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    }
});

export default AchievementsSection;