import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

interface ActionsSectionProps {
    onPasswordReset: () => void;
    onLogout: () => void;
    onDebugToken: () => void; // Add new prop for debug function
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
                                                           onPasswordReset,
                                                           onLogout,
                                                           onDebugToken,
                                                       }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account Actions</Text>

            <TouchableOpacity style={styles.actionItem} onPress={onPasswordReset}>
                <MaterialIcons name="lock" size={24} color="#50703C"/>
                <Text style={styles.actionText}>Change Password</Text>
                <MaterialIcons name="chevron-right" size={24} color="#CCCCCC"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={onLogout}>
                <MaterialIcons name="logout" size={24} color="#D32F2F"/>
                <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
                <MaterialIcons name="chevron-right" size={24} color="#CCCCCC"/>
            </TouchableOpacity>

            {/* Debug Button */}
            <TouchableOpacity style={styles.actionItem} onPress={onDebugToken}>
                <MaterialIcons name="bug-report" size={24} color="#4285F4"/>
                <Text style={[styles.actionText, styles.debugText]}>Debug Token</Text>
                <MaterialIcons name="chevron-right" size={24} color="#CCCCCC"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333333',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    actionText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333333',
    },
    logoutText: {
        color: '#D32F2F',
    },
    debugText: {
        color: '#4285F4',
    },
});

export default ActionsSection;
