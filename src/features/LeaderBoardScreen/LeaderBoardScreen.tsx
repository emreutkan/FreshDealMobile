import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';

// Example data for the leaderboard
const leaderboardData = [
    {id: '1', name: 'Alice', rank: 1},
    {id: '2', name: 'Bob', rank: 2},
    {id: '3', name: 'You', rank: 3},
    {id: '4', name: 'Charlie', rank: 4},
    {id: '5', name: 'David', rank: 5},
    {id: '6', name: 'Eve', rank: 6},
];

const LeaderboardScreen: React.FC = () => {
    const renderItem = ({item}: { item: { id: string; name: string; rank: number } }) => {
        const isCurrentUser = item.name === 'You';

        return (
            <View style={[styles.itemContainer, isCurrentUser && styles.currentUserItem]}>
                <Text style={styles.rankText}>{item.rank}</Text>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <FlatList
                data={leaderboardData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3,
        // Elevation for Android
        elevation: 2,
    },
    currentUserItem: {
        backgroundColor: '#d0f0c0', // Light green background to highlight the current user
    },
    rankText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#50703C',
        marginRight: 16,
        width: 40,
        textAlign: 'center',
    },
    nameText: {
        fontSize: 18,
        color: '#333',
    },
});

export default LeaderboardScreen;
