import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface ActionsSectionProps {
    onPasswordReset: () => void;
    onLogout: () => void;
    onDebugToken: () => void;
    onEdit: () => void;
    isEditing: boolean;
}

const ActionButton: React.FC<{
    icon: string;
    label: string;
    color?: string;
    onPress: () => void;
    destructive?: boolean;
    isActive?: boolean;
}> = ({icon, label, color = "#50703C", onPress, destructive, isActive}) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 50,
            bounciness: 5
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 5
        }).start();
    };

    return (
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
            <TouchableOpacity
                style={[
                    styles.actionItem,
                    destructive && styles.destructiveAction,
                    isActive && styles.activeAction
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
            >
                <View style={[
                    styles.actionIconContainer,
                    {backgroundColor: isActive ? `${color}30` : `${color}10`}
                ]}>
                    <Ionicons
                        name={icon as any}
                        size={22}
                        color={color}
                    />
                </View>
                <Text style={[
                    styles.actionText,
                    destructive && styles.destructiveText,
                    isActive && styles.activeText
                ]}>
                    {isActive && label.includes("Edit") ? "Save Profile" : label}
                </Text>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={destructive ? "#D32F2F" : isActive ? color : "#CCCCCC"}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const ActionsSection: React.FC<ActionsSectionProps> = ({
                                                           onPasswordReset,
                                                           onLogout,
                                                           onDebugToken,
                                                           onEdit,
                                                           isEditing
                                                       }) => {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Ionicons name="settings-outline" size={20} color="#50703C"/>
                <Text style={styles.title}>Account Settings</Text>
            </View>

            <ActionButton
                icon="person-outline"
                label="Edit Profile"
                onPress={onEdit}
                isActive={isEditing}
            />

            <ActionButton
                icon="lock-closed-outline"
                label="Change Password"
                onPress={onPasswordReset}
            />

            <ActionButton
                icon="bug-outline"
                label="Debug Token"
                color="#4285F4"
                onPress={onDebugToken}
            />

            <ActionButton
                icon="log-out-outline"
                label="Logout"
                color="#D32F2F"
                onPress={onLogout}
                destructive
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 8,
        color: '#333',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    destructiveAction: {
        borderBottomWidth: 0,
    },
    activeAction: {
        backgroundColor: 'rgba(80, 112, 60, 0.05)',
        borderRadius: 12,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    actionIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    actionText: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#333',
    },
    destructiveText: {
        color: '#D32F2F',
    },
    activeText: {
        color: '#50703C',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default ActionsSection;