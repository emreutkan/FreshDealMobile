import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Feather, MaterialIcons} from '@expo/vector-icons';

interface Achievement {
    id: number;
    name: string;
    icon: string;
    unlocked: boolean;
}

interface AchievementsSectionProps {
    achievements: Achievement[];
    onViewAchievements: () => void;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({achievements, onViewAchievements}) => {
    return (
        <View style={styles.achievementsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <TouchableOpacity onPress={onViewAchievements}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
                {achievements.map((achievement) => (
                    <View
                        key={achievement.id}
                        style={[
                            styles.achievementBadge,
                            !achievement.unlocked && styles.lockedAchievement,
                        ]}
                    >
                        <Feather
                            name={achievement.icon as any}
                            size={24}
                            color={achievement.unlocked ? '#50703C' : '#aaaaaa'}
                        />
                        <Text style={[styles.achievementName, !achievement.unlocked && styles.lockedAchievementText]}>
                            {achievement.name}
                        </Text>
                        {!achievement.unlocked && (
                            <MaterialIcons name="lock" size={12} color="#aaaaaa" style={styles.lockIcon}/>
                        )}
                    </View>
                ))}
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
        width: 100,
        height: 100,
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
    },
    achievementName: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 8,
    },
    lockedAchievementText: {
        color: '#aaaaaa',
    },
    lockIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});

export default AchievementsSection;
