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
    View
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/store/store';
import {Feather} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {logout, updateEmail, updatePassword, updateUsername} from '@/store/userSlice';

const AccountScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        name_surname,
        email,
        phoneNumber,
        loading,
        error
    } = useSelector((state: RootState) => state.user);

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        name_surname: name_surname,
        email: email,
        phoneNumber: phoneNumber
    });

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                        router.replace('/features/LoginRegister/screens/loginPage'); // Navigate to login page
                    }
                }
            ]
        );
    };

    const handleCancel = () => {
        // Reset edited values to current values in Redux store
        setEditedValues({
            name_surname: name_surname,
            email: email,
            phoneNumber: phoneNumber
        });
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
                                    const resultAction = await dispatch(updatePassword({
                                        oldPassword,
                                        newPassword
                                    }));

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
            Alert.alert(
                'Save Changes',
                'Do you want to save these changes?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: handleCancel
                    },
                    {
                        text: 'Save',
                        onPress: async () => {
                            const updates = [];

                            if (editedValues.name_surname !== name_surname) {
                                updates.push(
                                    dispatch(updateUsername({
                                        newUsername: editedValues.name_surname
                                    }))
                                );
                            }

                            if (editedValues.email !== email) {
                                updates.push(
                                    dispatch(updateEmail({
                                        oldEmail: email,
                                        newEmail: editedValues.email
                                    }))
                                );
                            }

                            if (updates.length > 0) {
                                try {
                                    const results = await Promise.all(updates);
                                    const hasErrors = results.some(
                                        result => result.type.endsWith('/rejected')
                                    );

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
                        }
                    }
                ]
            );
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
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="black"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Account</Text>
                    <TouchableOpacity onPress={handleEditInfo}>
                        <Feather
                            name={isEditing ? "check" : "settings"}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileSection}>
                    <Image
                        source={{uri: 'https://via.placeholder.com/100'}}
                        style={styles.profileImage}
                    />
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
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoTitle}>Email</Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.infoText, styles.input]}
                                value={editedValues.email}
                                onChangeText={(text) =>
                                    setEditedValues({...editedValues, email: text})
                                }
                                keyboardType="email-address"
                                placeholder="Enter your email"
                            />
                        ) : (
                            <Text style={styles.infoText}>
                                {email || 'No email provided'}
                            </Text>
                        )}
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoTitle}>Phone Number</Text>
                        <Text style={styles.infoText}>
                            {phoneNumber || 'No phone number provided'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handlePasswordReset}
                >
                    <Text style={styles.resetButtonText}>Reset Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 15,
        color: '#333',
    },
    infoSection: {
        width: '100%',
    },
    infoItem: {
        marginBottom: 15,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
    },
    resetButton: {
        marginTop: 30,
        backgroundColor: '#50703C',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 8,
        backgroundColor: '#fff',
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: 15,
        backgroundColor: '#FF4444',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AccountScreen;