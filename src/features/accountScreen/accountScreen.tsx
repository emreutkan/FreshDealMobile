import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import AccountHeader from './components/AccountHeader';
import ProfileSection from './components/ProfileSection';
import AchievementsSection from './components/AchievementsSection';
import InfoCards from './components/InfoCards';
import OrdersSection from './components/OrdersSection';
import ChallengesSection from './components/ChallengesSection';
import ActionsSection from './components/ActionsSection';

import {RootStackParamList} from '@/src/utils/navigation';
import {RootState} from '@/src/types/store';
import {logout} from '@/src/redux/slices/userSlice';
import {updateEmailThunk, updatePasswordThunk, updateUsernameThunk} from '@/src/redux/thunks/userThunks';
import {AppDispatch} from '@/src/redux/store';

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ACHIEVEMENTS = [
    {id: 1, name: 'First Save', icon: 'star', unlocked: true},
    {id: 2, name: 'Save Streak: 3 Days', icon: 'fire', unlocked: true},
    {id: 3, name: 'Big Spender', icon: 'dollar-sign', unlocked: false},
    {id: 4, name: 'Eco Warrior', icon: 'leaf', unlocked: false},
];

const AccountScreen: React.FC = () => {
    // Redux and navigation hooks
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();
    const insets = useSafeAreaInsets();

    // Redux state
    const {name_surname, email, phoneNumber, moneySaved, foodSaved, loading} = useSelector(
        (state: RootState) => state.user
    );

    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        name_surname,
        email,
        phoneNumber,
    });

    // Derived data
    const userLevel = Math.floor(foodSaved / 10) + 1;
    const progressToNextLevel = (foodSaved % 10) / 10;
    const streakDays = 5; // This would typically come from state
    const environmentalImpact = {
        co2Saved: (foodSaved * 2.5).toFixed(1),
        waterSaved: (foodSaved * 1000).toFixed(0),
    };

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
        Alert.alert('Coming Soon', 'Achievements screen is under development');
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
            <ScrollView style={styles.safeArea}>
                <View style={styles.container}>
                    <ProfileSection
                        isEditing={isEditing}
                        editedValues={editedValues}
                        setEditedValues={setEditedValues}
                        name_surname={name_surname}
                        userLevel={userLevel}
                        progressToNextLevel={progressToNextLevel}
                        streakDays={streakDays}
                        moneySaved={moneySaved}
                        foodSaved={foodSaved}
                        environmentalImpact={environmentalImpact}
                    />
                    <AchievementsSection achievements={ACHIEVEMENTS} onViewAchievements={handleViewAchievements}/>
                    <InfoCards
                        isEditing={isEditing}
                        email={email}
                        phoneNumber={phoneNumber}
                        editedValues={editedValues}
                        setEditedValues={setEditedValues}
                    />
                    <OrdersSection navigation={navigation}/>
                    <ChallengesSection/>
                    <ActionsSection onPasswordReset={handlePasswordReset} onLogout={handleLogout}/>
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
});

export default AccountScreen;
