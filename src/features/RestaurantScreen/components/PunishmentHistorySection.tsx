// src/features/RestaurantScreen/components/PunishmentHistorySection.tsx

import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {format} from 'date-fns';
import {faCheck, faClock, faExclamationTriangle, faTimes} from '@fortawesome/free-solid-svg-icons';
import {AppDispatch} from "@/src/redux/store";
import {clearPunishmentHistory, fetchPunishmentHistory} from "@/src/redux/slices/PunishmentHistorySlice";
import {PunishmentHistory} from "@/src/services/RestaurantPunishmentService";
import {RootState} from "@/src/types/store";

interface PunishmentHistorySectionProps {
    restaurantId: number;
}

const PunishmentHistorySection: React.FC<PunishmentHistorySectionProps> = ({restaurantId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {data, loading, error} = useSelector((state: RootState) => state.punishmentHistory);

    useEffect(() => {
        dispatch(fetchPunishmentHistory(restaurantId));

        return () => {
            dispatch(clearPunishmentHistory());
        };
    }, [dispatch, restaurantId]);

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    };

    const renderPunishmentItem = ({item}: { item: PunishmentHistory }) => {
        const isActive = item.is_active;
        const isReverted = item.is_reverted;

        let statusIcon = faClock;
        let statusColor = '#FFA500'; // Orange for pending

        if (isActive) {
            statusIcon = faExclamationTriangle;
            statusColor = '#FF0000'; // Red for active
        } else if (isReverted) {
            statusIcon = faTimes;
            statusColor = '#FF6347'; // Tomato for reverted
        } else if (!isActive && new Date(item.end_date) < new Date()) {
            statusIcon = faCheck;
            statusColor = '#4CAF50'; // Green for completed
        }

        return !item.is_reverted ? (
            <View style={styles.punishmentItem}>
                <View style={styles.punishmentHeader}>
                    <Text style={styles.punishmentType}>{item.type}</Text>
                </View>
                <Text style={styles.reasonText}>{item.reason}</Text>
                <View style={styles.punishmentDetails}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{item.duration_days} days</Text>
                </View>
                <View style={styles.punishmentDetails}>
                    <Text style={styles.detailLabel}>Start Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(item.start_date)}</Text>
                </View>
                <View style={styles.punishmentDetails}>
                    <Text style={styles.detailLabel}>End Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(item.end_date)}</Text>
                </View>
            </View>
        ) : (
            <View style={styles.punishmentItem}/>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchPunishmentHistory(restaurantId))}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Punishment History</Text>

            {data && data.punishment_history.length > 0 ? (
                <FlatList
                    data={data.punishment_history}
                    renderItem={renderPunishmentItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No punishment history found</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#0066cc',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 16,
    },
    punishmentItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    punishmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 12,
    },
    punishmentType: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    reasonText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
        color: '#333',
    },
    punishmentDetails: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    detailLabel: {
        fontWeight: '500',
        color: '#666',
        width: 100,
    },
    detailValue: {
        flex: 1,
        color: '#333',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    }
});

export default PunishmentHistorySection;