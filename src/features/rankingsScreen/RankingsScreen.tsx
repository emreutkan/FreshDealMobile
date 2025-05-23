import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '@/src/utils/navigation';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from '@/src/types/store';
import {getUserRankingsThunk} from '@/src/redux/thunks/userThunks';
import {UserRank} from "@/src/types/states";
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RankingsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();

    const {rankings, rankingsLoading, userId} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(getUserRankingsThunk());
        console.log("Rankings in component:", rankings);
    }, [dispatch]);

    const renderRankItem = ({item}: { item: UserRank }) => {
        const isCurrentUser = item.user_id === userId;
        const getMedalIcon = (rank: number) => {
            switch (rank) {
                case 1:
                    return {name: 'medal', color: '#FFD700'};
                case 2:
                    return {name: 'medal', color: '#C0C0C0'};
                case 3:
                    return {name: 'medal', color: '#CD7F32'};
                default:
                    return {name: 'medal-outline', color: '#50703C'};
            }
        };

        const {name, color} = getMedalIcon(item.rank);

        return (
            <View style={[
                styles.rankItem,
                isCurrentUser && styles.currentUserItem
            ]}>
                <View style={styles.rankNumberContainer}>
                    <MaterialCommunityIcons name={name} size={24} color={color}/>
                    <Text style={styles.rankNumber}>#{item.rank}</Text>
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.user_name}</Text>
                    {isCurrentUser && (
                        <Text style={styles.currentUser}>(You)</Text>
                    )}
                </View>

                <View style={styles.discountContainer}>
                    <Text style={styles.discountAmount}>{Math.abs(item.total_discount).toFixed(2)} TL</Text>
                </View>
            </View>
        );
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const hasRankings = Array.isArray(rankings) && rankings.length > 0;

    const insets = useSafeAreaInsets();
    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,

                },
            ]}
        > <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color="#333"/>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <View style={styles.placeholder}/>
        </View>

            <View style={styles.contentContainer}>
                <View style={styles.infoCard}>
                    <MaterialCommunityIcons name="trophy" size={24} color="#50703C"/>
                    <Text style={styles.infoText}>Earn rewards by purchasing discounted items</Text>
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.rankHeaderText}>Rank</Text>
                    <Text style={styles.userHeaderText}>User</Text>
                    <Text style={styles.savingsHeaderText}>Savings</Text>
                </View>

                {rankingsLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#50703C"/>
                        <Text style={styles.loadingText}>Loading rankings...</Text>
                    </View>
                ) : (
                    hasRankings ? (
                        <FlatList
                            data={rankings}
                            renderItem={renderRankItem}
                            keyExtractor={item => item.user_id.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="trophy-outline" size={64} color="#ccc"/>
                            <Text style={styles.emptyText}>No rankings available</Text>
                        </View>
                    )
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Poppins-Bold',
    },
    placeholder: {
        width: 40,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9EB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#50703C',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 12,
    },
    rankHeaderText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'left',
        fontFamily: 'Poppins-SemiBold',
    },
    userHeaderText: {
        flex: 2,
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        fontFamily: 'Poppins-SemiBold',
    },
    savingsHeaderText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    listContent: {
        paddingBottom: 16,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    currentUserItem: {
        backgroundColor: '#F0F9EB',
        borderWidth: 1,
        borderColor: '#50703C',
    },
    rankNumberContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankNumber: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
        fontFamily: 'Poppins-SemiBold',
        color: '#374151',
    },
    userInfo: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        fontFamily: 'Poppins-Medium',
    },
    currentUser: {
        fontSize: 14,
        color: '#50703C',
        marginLeft: 8,
        fontStyle: 'italic',
        fontFamily: 'Poppins-Regular',
    },
    discountContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    discountAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#50703C',
        fontFamily: 'Poppins-SemiBold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
});

export default RankingsScreen;