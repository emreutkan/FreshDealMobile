import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

interface RankingCardProps {
    rank: number;
    totalDiscount: number;
    isLoading?: boolean;
    onViewAllRankings?: () => void;
}

const RankingCard: React.FC<RankingCardProps> = ({
                                                     rank,
                                                     totalDiscount,
                                                     isLoading = false,
                                                     onViewAllRankings
                                                 }) => {
    // Get medal icon based on rank
    const getMedalIcon = () => {
        switch (rank) {
            case 1:
                return {name: 'medal', color: '#FFD700'}; // Gold
            case 2:
                return {name: 'medal', color: '#C0C0C0'}; // Silver
            case 3:
                return {name: 'medal', color: '#CD7F32'}; // Bronze
            default:
                return {name: 'medal-outline', color: '#50703C'}; // Default
        }
    };

    const {name, color} = getMedalIcon();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Ranking</Text>
                <TouchableOpacity onPress={onViewAllRankings}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#50703C"/>
                </View>
            ) : (
                <View style={styles.content}>
                    <View style={styles.rankSection}>
                        <MaterialCommunityIcons name={name} size={32} color={color}/>
                        <Text style={styles.rankText}>Rank #{rank}</Text>
                    </View>

                    <View style={styles.savingsSection}>
                        <MaterialCommunityIcons name="cash" size={24} color="#50703C"/>
                        <Text style={styles.savingsText}>${totalDiscount.toFixed(2)} Saved</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    viewAll: {
        fontSize: 14,
        color: '#50703C',
        fontWeight: '500',
    },
    loadingContainer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rankSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankText: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 8,
        color: '#333',
    },
    savingsSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    savingsText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
        color: '#50703C',
    },
});

export default RankingCard;