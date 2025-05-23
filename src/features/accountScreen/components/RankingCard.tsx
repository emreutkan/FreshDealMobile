import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {RootState} from "@/src/types/store";
import {getUserRankThunk} from "@/src/redux/thunks/userThunks";
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {LinearGradient} from 'expo-linear-gradient';

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RankingCard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        dispatch(getUserRankThunk());
    }, []);

    const rank = useSelector((state: RootState) => state.user.rank);
    const totalDiscount = useSelector((state: RootState) => state.user.totalDiscount);
    const rankLoading = useSelector((state: RootState) => state.user.rankLoading);

    console.log(rank, totalDiscount, rankLoading);

    const handleViewAllRankings = () => {
        navigation.navigate('Rankings');
    };

    const getRankMedalColor = () => {
        if (rank <= 3) return '#FFD700'; // Gold
        if (rank <= 10) return '#C0C0C0'; // Silver
        if (rank <= 20) return '#CD7F32'; // Bronze
        return '#50703C'; // Default green
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(80, 112, 60, 0.05)', 'rgba(80, 112, 60, 0.15)']}
                style={styles.gradientBackground}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            >
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="trophy-outline" size={20} color="#50703C"/>
                        <Text style={styles.title}>Your Ranking</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.viewAllButton}
                        onPress={handleViewAllRankings}
                    >
                        <Text style={styles.viewAll}>View All</Text>
                        <Ionicons name="chevron-forward" size={16} color="#50703C"/>
                    </TouchableOpacity>
                </View>

                {rankLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#50703C"/>
                    </View>
                ) : (
                    <View style={styles.content}>
                        <View style={styles.rankSection}>
                            <View style={[styles.medalContainer, {borderColor: getRankMedalColor()}]}>
                                <MaterialCommunityIcons
                                    name="medal"
                                    size={32}
                                    color={getRankMedalColor()}
                                />
                            </View>
                            <View style={styles.rankTextContainer}>
                                <Text style={styles.rankLabel}>Current Rank</Text>
                                <Text style={styles.rankText}>#{rank}</Text>
                            </View>
                        </View>

                        <View style={styles.divider}/>

                        <View style={styles.savingsSection}>
                            <View style={styles.savingsIconContainer}>
                                <Ionicons name="wallet-outline" size={22} color="#50703C"/>
                            </View>
                            <View>
                                <Text style={styles.savingsLabel}>Total Savings</Text>

                                <Text style={styles.savingsText}>{Math.abs(Number(totalDiscount.toFixed(2)))} TL</Text>
                            </View>
                        </View>
                    </View>
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    gradientBackground: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 112, 60, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    viewAll: {
        fontSize: 14,
        color: '#50703C',
        fontWeight: '500',
        marginRight: 4,
        fontFamily: 'Poppins-Medium',
    },
    loadingContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    rankSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    medalContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginRight: 16,
    },
    rankTextContainer: {
        flex: 1,
    },
    rankLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    rankText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        fontFamily: 'Poppins-Bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
        marginVertical: 16,
    },
    savingsSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    savingsIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(80, 112, 60, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    savingsLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    savingsText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#50703C',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default RankingCard;