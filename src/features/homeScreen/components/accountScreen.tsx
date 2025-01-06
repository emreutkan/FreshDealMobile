import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/store/store';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {updateEmail, updatePassword, updateUsername} from '@/store/thunks/userThunks';
import {logout} from '@/store/slices/userSlice';

// Define the RootStackParamList for navigation
type RootStackParamList = {
    LoginPage: undefined;
    HomeScreen: undefined;
};

type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const AccountScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<AccountScreenNavigationProp>();

    const {name_surname, email, phoneNumber, loading} = useSelector((state: RootState) => state.user);

    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        name_surname,
        email,
        phoneNumber,
    });

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {text: 'Cancel', style: 'cancel'},
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    dispatch(logout());
                    navigation.replace('LoginPage'); // Use React Navigation
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
                                    const resultAction = await dispatch(updatePassword({oldPassword, newPassword}));
                                    if (updatePassword.fulfilled.match(resultAction)) {
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
                            updates.push(dispatch(updateUsername({newUsername: editedValues.name_surname})));
                        }
                        if (editedValues.email !== email) {
                            updates.push(dispatch(updateEmail({oldEmail: email, newEmail: editedValues.email})));
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#50703C"/>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Feather name="arrow-left" size={24} color="#333"/>
                </TouchableOpacity>
                <Text style={styles.title}>Account</Text>
                <TouchableOpacity onPress={handleEditInfo} style={styles.iconButton}>
                    <Feather name={isEditing ? 'check' : 'settings'} size={24} color="#333"/>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <Image source={{uri: 'https://via.placeholder.com/100'}} style={styles.profileImage}/>
                        {isEditing ? (
                            <TextInput
                                style={[styles.userName, styles.input]}
                                value={editedValues.name_surname}
                                onChangeText={(text) => setEditedValues({...editedValues, name_surname: text})}
                                placeholder="Enter your name"
                            />
                        ) : (
                            <Text style={styles.userName}>{name_surname}</Text>
                        )}
                    </View>
                    <View style={styles.infoSection}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoTitle}>Email</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.infoText, styles.input]}
                                    value={editedValues.email}
                                    onChangeText={(text) => setEditedValues({...editedValues, email: text})}
                                    keyboardType="email-address"
                                    placeholder="Enter your email"
                                />
                            ) : (
                                <Text style={styles.infoText}>{email || 'No email provided'}</Text>
                            )}
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoTitle}>Phone Number</Text>
                            <Text style={styles.infoText}>{phoneNumber || 'No phone number provided'}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
                    <Text style={styles.resetButtonText}>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },
    iconButton: {padding: 8},
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    container: {flex: 1, paddingHorizontal: 16, paddingVertical: 20},
    loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    profileCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    profileHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
    profileImage: {width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc'},
    userName: {fontSize: 18, fontWeight: '600', marginLeft: 15, color: '#333', flex: 1},
    infoSection: {marginTop: 4},
    infoItem: {marginBottom: 10},
    infoTitle: {fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 4},
    infoText: {fontSize: 14, color: '#333'},
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 8,
        backgroundColor: '#fff',
        marginTop: 2,
    },
    resetButton: {
        marginTop: 10,
        backgroundColor: '#50703C',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {fontSize: 16, color: '#fff', fontWeight: '600'},
    logoutButton: {
        marginTop: 15,
        backgroundColor: '#FF4444',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {fontSize: 16, color: '#fff', fontWeight: '600'},
});

export default AccountScreen;
