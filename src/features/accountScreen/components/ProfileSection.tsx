import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Feather, FontAwesome5, MaterialCommunityIcons,} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

interface ProfileSectionProps {
    isEditing: boolean;
    editedValues: { name_surname: string; email: string; phoneNumber: string };
    setEditedValues: React.Dispatch<
        React.SetStateAction<{ name_surname: string; email: string; phoneNumber: string }>
    >;
    name_surname: string;
    userLevel: number;
    progressToNextLevel: number;
    streakDays: number;
    moneySaved: number;
    foodSaved: number;
    environmentalImpact: { co2Saved: string; waterSaved: string };
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
                                                           isEditing,
                                                           editedValues,
                                                           setEditedValues,
                                                           name_surname,
                                                           userLevel,
                                                           progressToNextLevel,
                                                           streakDays,
                                                           moneySaved,
                                                           foodSaved,
                                                           environmentalImpact,
                                                       }) => {
    const navigation = useNavigation();
    // Fake rank value for demonstration purposes
    const fakeRank = 3;

    return (
        <View style={styles.profileSection}>
            {/* Wrap the avatar container so that tapping it navigates to the Leaderboard */}
            <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <MaterialCommunityIcons name="food" size={40} color="#50703C"/>
                        <View style={styles.badge}>
                            <Feather name="award" size={16} color="#fff"/>
                        </View>
                        {/* Rank badge overlay */}
                        <View style={styles.rankBadge}>
                            <Text style={styles.rankBadgeText}>{fakeRank}</Text>
                        </View>
                    </View>
                    {isEditing ? (
                        <TextInput
                            style={[styles.userName, styles.input]}
                            value={editedValues.name_surname}
                            onChangeText={(text) =>
                                setEditedValues({...editedValues, name_surname: text})
                            }
                            placeholder="Enter your name"
                        />
                    ) : (
                        <Text style={styles.userName}>{name_surname}</Text>
                    )}
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelLabel}>Level {userLevel}</Text>
                        <View style={styles.progressBarContainer}>
                            <View
                                style={[styles.progressBar, {width: `${progressToNextLevel * 100}%`}]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {Math.round(progressToNextLevel * 100)}% to Level {userLevel + 1}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.streakContainer}>
                <FontAwesome5 name="fire" size={20} color="#ff7700"/>
                <Text style={styles.streakText}>{streakDays} Day Streak!</Text>
            </View>
            {/* Gamification and environmental impact sections */}
            <View style={styles.gamificationContainer}>
                <View style={styles.gamificationCard}>
                    <Text style={styles.gamificationLabel}>Money Saved</Text>
                    <Text style={styles.gamificationValue}>${moneySaved}</Text>
                </View>
                <View style={styles.gamificationCard}>
                    <Text style={styles.gamificationLabel}>Food Saved</Text>
                    <Text style={styles.gamificationValue}>{foodSaved}</Text>
                </View>
            </View>
            <View style={styles.impactContainer}>
                <Text style={styles.impactTitle}>Your Environmental Impact</Text>
                <View style={styles.impactStatsContainer}>
                    <View style={styles.impactStat}>
                        <FontAwesome5 name="cloud" size={24} color="#50703C"/>
                        <Text style={styles.impactValue}>{environmentalImpact.co2Saved} kg</Text>
                        <Text style={styles.impactLabel}>CO₂ Saved</Text>
                    </View>
                    <View style={styles.impactStat}>
                        <FontAwesome5 name="tint" size={24} color="#50703C"/>
                        <Text style={styles.impactValue}>{environmentalImpact.waterSaved} L</Text>
                        <Text style={styles.impactLabel}>Water Saved</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
        marginBottom: 18,
    },
    avatarContainer: {
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 3,
        borderColor: '#50703C',
    },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#50703C',
        borderRadius: 10,
        padding: 2,
    },
    // New rank badge style
    rankBadge: {
        position: 'absolute',
        top: -5,
        left: -5,
        backgroundColor: '#ffc107',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    rankBadgeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    userName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    levelContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    levelLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#50703C',
        marginBottom: 4,
    },
    progressBarContainer: {
        width: '80%',
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#50703C',
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff8e1',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    streakText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#ff7700',
    },
    gamificationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 8,
        marginBottom: 16,
    },
    gamificationCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    gamificationLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    gamificationValue: {
        fontSize: 16,
        color: '#50703C',
        fontWeight: '600',
    },
    impactContainer: {
        width: '100%',
        backgroundColor: '#f1f8e9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    impactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    impactStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    impactStat: {
        alignItems: 'center',
    },
    impactValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#50703C',
        marginTop: 4,
    },
    impactLabel: {
        fontSize: 12,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default ProfileSection;
