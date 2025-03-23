import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';

const ChallengesSection: React.FC = () => {
    return (
        <View style={styles.challengesSection}>
            <Text style={styles.sectionTitle}>Current Challenges</Text>
            <View style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                    <FontAwesome5 name="calendar-check" size={20} color="#50703C"/>
                    <Text style={styles.challengeName}>Weekly Challenge</Text>
                </View>
                <Text style={styles.challengeDescription}>
                    Save 5 more meals this week
                </Text>
                <View style={styles.challengeProgressContainer}>
                    <View style={styles.challengeProgressBar}>
                        <View style={[styles.challengeProgress, {width: '40%'}]}/>
                    </View>
                    <Text style={styles.challengeProgressText}>2/5 meals</Text>
                </View>
                <Text style={styles.challengeReward}>
                    Reward: 50 points + Level 3 Saver badge
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    challengesSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        paddingLeft: 4,
    },
    challengeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    challengeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    challengeDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    challengeProgressContainer: {
        marginBottom: 10,
    },
    challengeProgressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 5,
    },
    challengeProgress: {
        height: '100%',
        backgroundColor: '#50703C',
    },
    challengeProgressText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    challengeReward: {
        fontSize: 12,
        color: '#50703C',
        fontWeight: '500',
    },
});

export default ChallengesSection;
