import React from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';

const AccountScreen: React.FC = () => {
    // Fetch user data from Redux state
    const {name_surname, email, phoneNumber} = useSelector((state: RootState) => state.user);

    // Function to handle password reset
    const handlePasswordReset = () => {
        Alert.alert(
            'Reset Password',
            'Are you sure you want to reset your password?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => console.log('Password reset initiated')},
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    source={{uri: 'https://via.placeholder.com/100'}} // Replace with user's actual PFP if available
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{name_surname || 'User Name'}</Text>
            </View>

            {/* Information Section */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Email</Text>
                <Text style={styles.infoText}>{email || 'No email provided'}</Text>

                <Text style={styles.infoTitle}>Phone Number</Text>
                <Text style={styles.infoText}>{phoneNumber || 'No phone number provided'}</Text>
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
                <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
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
    },
    infoSection: {
        width: '100%',
        marginVertical: 10,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    resetButton: {
        marginTop: 30,
        backgroundColor: '#50703C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    resetButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AccountScreen;
