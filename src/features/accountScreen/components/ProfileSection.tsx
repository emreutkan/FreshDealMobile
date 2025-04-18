import React from 'react';
import {Animated, StyleSheet, Text, TextInput, View} from 'react-native';
import {useSelector} from "react-redux";
import {RootState} from "@/src/types/store";
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

interface ProfileSectionProps {
    isEditing: boolean,
    editedValues: {
        name_surname: string;
    },
    setEditedValues: React.Dispatch<React.SetStateAction<{
        name_surname: string;
        email: string;
        phoneNumber: string;
    }>>,
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
                                                           isEditing,
                                                           editedValues,
                                                           setEditedValues,
                                                       }) => {
    const getInitials = (name: string) => {
        if (!name) return "?";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const name_surname = useSelector((state: RootState) => state.user.name_surname);
    const spinValue = new Animated.Value(0);

    // Spin animation for the avatar when editing
    React.useEffect(() => {
        if (isEditing) {
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(spinValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isEditing]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <Animated.View
                    style={[
                        styles.avatarContainer,
                        {transform: [{rotate: spin}]}
                    ]}
                >
                    <LinearGradient
                        colors={isEditing ? ['#50703C', '#7fa25c'] : ['#50703C', '#3d5a2c']}
                        style={styles.avatarGradient}
                    >
                        <Text style={styles.avatarText}>{getInitials(name_surname)}</Text>
                    </LinearGradient>
                </Animated.View>

                <View style={styles.nameContainer}>
                    {isEditing ? (
                        <View style={styles.editContainer}>
                            <Ionicons
                                name="pencil-outline"
                                size={18}
                                color="#50703C"
                                style={styles.editIcon}
                            />
                            <TextInput
                                style={styles.nameInput}
                                value={editedValues.name_surname}
                                onChangeText={(text) =>
                                    setEditedValues((prev) => ({...prev, name_surname: text}))
                                }
                                placeholder="Full Name"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.nameLabel}>ACCOUNT NAME</Text>
                            <Text style={styles.name}>{name_surname}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    avatarGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 26,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    nameContainer: {
        flex: 1,
    },
    nameLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.5,
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins-SemiBold',
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#50703C',
        paddingBottom: 6,
    },
    editIcon: {
        marginRight: 8,
    },
    nameInput: {
        flex: 1,
        fontSize: 20,
        fontWeight: '500',
        color: '#333',
        fontFamily: 'Poppins-Medium',
        padding: 0,
    },
});

export default ProfileSection;