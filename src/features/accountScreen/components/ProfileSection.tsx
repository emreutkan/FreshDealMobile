import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {useSelector} from "react-redux";
import {RootState} from "@/src/types/store";

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
    // Get user initials for avatar
    const getInitials = (name: string) => {
        if (!name) return "?";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };


    const name_surname = useSelector((state: RootState) => state.user.name_surname);

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{getInitials(name_surname)}</Text>
                </View>

                <View style={styles.nameContainer}>
                    {isEditing ? (
                        <TextInput
                            style={styles.nameInput}
                            value={editedValues.name_surname}
                            onChangeText={(text) =>
                                setEditedValues((prev) => ({...prev, name_surname: text}))
                            }
                            placeholder="Full Name"
                        />
                    ) : (
                        <Text style={styles.name}>{name_surname}</Text>
                    )}
                </View>
            </View>

            {/*/!* Money saved card *!/*/}
            {/*<View style={styles.moneySavedContainer}>*/}
            {/*    <View style={styles.moneySavedCard}>*/}
            {/*        <Feather name="dollar-sign" size={24} color="#50703C"/>*/}

            {/*        <Text style={styles.moneySavedValue}>*/}
            {/*            {moneySaved}*/}
            {/*        </Text>*/}
            {/*        <Text style={styles.moneySavedLabel}>Total Money Saved</Text>*/}
            {/*    </View>*/}
            {/*</View>*/}
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
        marginBottom: 16,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#50703C',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
    },
    nameContainer: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },
    nameInput: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#50703C',
        paddingBottom: 4,
    },
    moneySavedContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    moneySavedCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        width: '90%',
    },
    moneySavedValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    moneySavedLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

export default ProfileSection;