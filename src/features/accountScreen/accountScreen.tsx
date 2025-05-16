import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import ProfileSection from './components/ProfileSection';
import RankingCard from './components/RankingCard';
import AchievementsSection from './components/AchievementsSection';
import InfoCards from './components/InfoCards';
import OrdersSection from './components/OrdersSection';
import ActionsSection from './components/ActionsSection';
import EnvironmentalImpactCard from './components/EnvironmentalImpactCard';

import {RootStackParamList} from '@/src/utils/navigation';
import {RootState} from '@/src/types/store';
import {logout} from '@/src/redux/slices/userSlice';
import {updateEmailThunk, updatePasswordThunk, updateUsernameThunk} from '@/src/redux/thunks/userThunks';
import {AppDispatch} from '@/src/redux/store';
import {fetchUserAchievementsThunk} from '@/src/redux/thunks/achievementThunks';
import {useSafeAreaInsets} from "react-native-safe-area-context";

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountScreen: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();
    const scrollY = useRef(new Animated.Value(0)).current;

    const {
        name_surname,
        email,
        phoneNumber,
        loading,
        token
    } = useSelector((state: RootState) => state.user);

    const {
        achievements = [],
        loading: achievementsLoading
    } = useSelector((state: RootState) => state.user);


    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        name_surname,
        email,
        phoneNumber,
    });
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setEditedValues({
            name_surname,
            email,
            phoneNumber,
        });
    }, [name_surname, email, phoneNumber]);

    useEffect(() => {
        // dispatch(getUserRankThunk());
        // dispatch(getUserRankingsThunk());
        dispatch(fetchUserAchievementsThunk());
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        dispatch(fetchUserAchievementsThunk())
            .finally(() => {
                setTimeout(() => {
                    setRefreshing(false);
                }, 300);
            });

    }, [dispatch]);

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
        navigation.navigate('Achievements');
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

    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.mainContainer, {paddingTop: insets.top}]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>

            <Animated.View style={[
                styles.animatedHeader,
            ]}>
            </Animated.View>

            <ScrollView
                style={styles.safeArea}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#50703C']}
                        tintColor="#50703C"
                        title="Refreshing..."
                        titleColor="#50703C"
                    />
                }
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.container}>
                    <ProfileSection
                        isEditing={isEditing}
                        editedValues={editedValues}
                        setEditedValues={setEditedValues}
                    />

                    <RankingCard/>

                    <EnvironmentalImpactCard/>

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
                        onDebugToken={handleDebugToken}
                        onEdit={handleEditInfo}
                        isEditing={isEditing}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
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
        fontFamily: 'Poppins-Regular',
    }
});

export default AccountScreen;