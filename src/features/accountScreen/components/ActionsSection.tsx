import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

interface ActionsSectionProps {
    onPasswordReset: () => void;
    onLogout: () => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({onPasswordReset, onLogout}) => {
    return (
        <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton} onPress={onPasswordReset}>
                <MaterialIcons name="lock" size={24} color="#50703C"/>
                <Text style={styles.actionButtonText}>Reset Password</Text>
                <MaterialIcons name="chevron-right" size={24} color="#666"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <MaterialIcons name="logout" size={24} color="#FFF"/>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    actionsSection: {
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    actionButtonText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#ff4444',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 16,
    },
    logoutButtonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default ActionsSection;
