import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GoBackIcon} from '@/src/features/homeScreen/components/goBack';

interface AccountHeaderProps {
    isEditing: boolean;
    onEdit: () => void;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({isEditing, onEdit}) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.topBar, {paddingTop: insets.top}]}>
            <GoBackIcon/>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
                <Feather name={isEditing ? 'check' : 'edit-2'} size={24} color="#50703C"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconButton: {
        padding: 8,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
});

export default AccountHeader;
