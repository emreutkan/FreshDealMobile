import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RootState} from "@/src/types/store";
import {getUserRankThunk} from "@/src/redux/thunks/userThunks";
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";


export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RankingCard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getUserRankThunk());

    }, []);
    const rank = useSelector((state: RootState) => state.user.rank);
    const totalDiscount = useSelector((state: RootState) => state.user.totalDiscount);
    const rankLoading = useSelector((state: RootState) => state.user.rankLoading);
    console.log(rank, totalDiscount, rankLoading);
    const navigation = useNavigation<NavigationProp>();

    const handleViewAllRankings = () => {
        navigation.navigate('Rankings');
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Ranking</Text>
                <TouchableOpacity onPress={handleViewAllRankings}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            {rankLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#50703C"/>
                </View>
            ) : (
                <View style={styles.content}>
                    <View style={styles.rankSection}>
                        <MaterialCommunityIcons name={"medal-outline"} size={32} color={"#50703C"}/>
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