import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import AccountHeader from './components/AccountHeader';
import ProfileSection from './components/ProfileSection';
import RankingCard from './components/RankingCard';
import AchievementsSection from './components/AchievementsSection';
import InfoCards from './components/InfoCards';
import OrdersSection from './components/OrdersSection';
import ActionsSection from './components/ActionsSection';

import {RootStackParamList} from '@/src/utils/navigation';
import {RootState} from '@/src/types/store';
import {logout} from '@/src/redux/slices/userSlice';
import {updateEmailThunk, updatePasswordThunk, updateUsernameThunk} from '@/src/redux/thunks/userThunks';
import {AppDispatch} from '@/src/redux/store';
import {fetchUserAchievementsThunk} from '@/src/redux/thunks/achievementThunks';

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountScreen: React.FC = () => {
    console.log("[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: Component initializing");

    // Redux and navigation hooks
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();

    // Redux state - user data
    const {
        name_surname,
        email,
        phoneNumber,
        loading,
        token
    } = useSelector((state: RootState) => state.user);

    // Redux state - achievements data
    const {
        achievements = [],
        loading: achievementsLoading
    } = useSelector((state: RootState) => state.user);

    console.log(`[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: User state loaded, achievements count: ${achievements.length}`);

    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        name_surname,
        email,
        phoneNumber,
    });

    // Add state for refresh control
    const [refreshing, setRefreshing] = useState(false);

    // Update edited values when user data changes
    useEffect(() => {
        setEditedValues({
            name_surname,
            email,
            phoneNumber,
        });
    }, [name_surname, email, phoneNumber]);

    // Fetch achievements on initial load
    useEffect(() => {
        console.log("[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: Initial fetch of achievements");
        dispatch(fetchUserAchievementsThunk());
    }, [dispatch]);

    // Refresh function - now also refreshes achievements
    const onRefresh = useCallback(() => {
        console.log("[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: Refreshing data");
        setRefreshing(true);

        // Dispatch achievement thunk when refreshing
        dispatch(fetchUserAchievementsThunk())
            .finally(() => {
                setTimeout(() => {
                    setRefreshing(false);
                    console.log("[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: Refresh complete");
                }, 300);
            });

    }, [dispatch]);

    // Event Handlers
    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {text: 'Cancel', style: 'cancel'},
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    dispatch(logout());
                    navigation.navigate('Login');
                },
            },
        ]);
    };

    const handleCancel = () => {
        setEditedValues({name_surname, email, phoneNumber});
        setIsEditing(false);
    };

    const handlePasswordReset = () => {
        Alert.prompt(
            'Reset Password',
            'Enter your current password',
            async (oldPassword?: string) => {
                if (oldPassword) {
                    Alert.prompt(
                        'New Password',
                        'Enter your new password',
                        async (newPassword?: string) => {
                            if (newPassword) {
                                try {
                                    const resultAction = await dispatch(
                                        updatePasswordThunk({
                                            old_password: oldPassword,
                                            new_password: newPassword,
                                        })
                                    );
                                    if (updatePasswordThunk.fulfilled.match(resultAction)) {
                                        Alert.alert('Success', 'Password updated successfully');
                                    } else {
                                        Alert.alert('Error', resultAction.payload as string);
                                    }
                                } catch (error) {
                                    Alert.alert('Error', 'Failed to update password');
                                }
                            }
                        },
                        'secure-text'
                    );
                }
            },
            'secure-text'
        );
    };

    const handleEditInfo = async () => {
        if (isEditing) {
            Alert.alert('Save Changes', 'Do you want to save these changes?', [
                {text: 'Cancel', style: 'cancel', onPress: handleCancel},
                {
                    text: 'Save',
                    onPress: async () => {
                        const updates = [];
                        if (editedValues.name_surname !== name_surname) {
                            updates.push(dispatch(updateUsernameThunk({username: editedValues.name_surname})));
                        }
                        if (editedValues.email !== email) {
                            updates.push(dispatch(updateEmailThunk({old_email: email, new_email: editedValues.email})));
                        }
                        if (updates.length > 0) {
                            try {
                                const results = await Promise.all(updates);
                                const hasErrors = results.some((result) => result.type.endsWith('/rejected'));
                                if (!hasErrors) {
                                    Alert.alert('Success', 'Profile updated successfully');
                                    setIsEditing(false);
                                } else {
                                    Alert.alert('Error', 'Some updates failed. Please try again.');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Failed to update profile');
                            }
                        } else {
                            setIsEditing(false);
                        }
                    },
                },
            ]);
        } else {
            setIsEditing(true);
        }
    };

    const handleViewAchievements = () => {
        console.log("[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: View Achievements triggered with", achievements.length, "achievements");

        if (achievements.length === 0) {
            Alert.alert(
                'No Achievements Available',
                'There are no achievements to display at the moment.',
                [{text: 'OK'}]
            );
            return;
        }

        // Count unlocked achievements (ones with earned_at date)
        const unlockedCount = achievements.filter(a => !!a.earned_at).length;
        const totalCount = achievements.length;

        // Create lists of unlocked and locked achievements
        const unlockedAchievements = achievements
            .filter(a => !!a.earned_at)
            .map(a => `✅ ${a.name}: ${a.description}${a.earned_at ? ` (${new Date(a.earned_at).toLocaleDateString()})` : ''}`)
            .join('\n');

        const lockedAchievements = achievements
            .filter(a => !a.earned_at)
            .map(a => `🔒 ${a.name}: ${a.description}${a.threshold ? ` (Required: ${a.threshold})` : ''}`)
            .join('\n');

        Alert.alert(
            'Achievements',
            `You've unlocked ${unlockedCount} out of ${totalCount} achievements.\n\n` +
            `UNLOCKED:\n${unlockedAchievements || 'None yet'}\n\n` +
            `LOCKED:\n${lockedAchievements || 'None'}`,
            [{text: 'OK'}]
        );
    };


    const handleDebugToken = () => {
        if (token) {
            console.log('[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: User Token:', token);
            Alert.alert('Debug Info', 'Token has been logged to console');
        } else {
            console.log('[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: No token found');
            Alert.alert('Debug Info', 'No token found');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#50703C"/>
            </View>
        );
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
            <AccountHeader isEditing={isEditing} onEdit={handleEditInfo}/>
            <ScrollView
                style={styles.safeArea}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#50703C']} // Android
                        tintColor="#50703C" // iOS
                        title="Refreshing..." // iOS
                        titleColor="#50703C" // iOS
                    />
                }
            >
                <View style={styles.container}>
                    <ProfileSection
                        isEditing={isEditing}
                        editedValues={editedValues}
                        setEditedValues={setEditedValues}
                    />

                    <RankingCard
                    />

                    {achievementsLoading ? (
                        <View style={styles.loadingSection}>
                            <ActivityIndicator size="small" color="#50703C"/>
                            <Text style={styles.loadingText}>Loading achievements...</Text>
                        </View>
                    ) : (
                        <AchievementsSection
                            achievements={achievements}
                            onViewAchievements={handleViewAchievements}
                        />
                    )}

                    <InfoCards
                        isEditing={isEditing}
                        email={email}
                        phoneNumber={phoneNumber}
                        editedValues={editedValues}
                        setEditedValues={setEditedValues}
                    />
                    <OrdersSection navigation={navigation}/>
                    <ActionsSection
                        onPasswordReset={handlePasswordReset}
                        onLogout={handleLogout}
                        onDebugToken={handleDebugToken} // Pass debug handler to ActionsSection
                    />
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingSection: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    loadingText: {
        marginTop: 8,
        color: '#666',
    }
});

export default AccountScreen;