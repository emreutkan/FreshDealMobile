import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

interface InfoCardsProps {
    isEditing: boolean;
    email: string;
    phoneNumber: string;
    editedValues: { name_surname: string; email: string; phoneNumber: string };
    setEditedValues: React.Dispatch<
        React.SetStateAction<{ name_surname: string; email: string; phoneNumber: string }>
    >;
}

const InfoCards: React.FC<InfoCardsProps> = ({isEditing, email, phoneNumber, editedValues, setEditedValues}) => {
    return (
        <View style={styles.infoCards}>
            <View style={styles.card}>
                <View style={styles.cardIcon}>
                    <MaterialIcons name="email" size={24} color="#50703C"/>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Email</Text>
                    {isEditing ? (
                        <TextInput
                            style={[styles.cardValue, styles.input]}
                            value={editedValues.email}
                            onChangeText={(text) => setEditedValues({...editedValues, email: text})}
                            keyboardType="email-address"
                            placeholder="Enter your email"
                        />
                    ) : (
                        <Text style={styles.cardValue}>{email || 'No email provided'}</Text>
                    )}
                </View>
            </View>
            <View style={styles.card}>
                <View style={styles.cardIcon}>
                    <MaterialIcons name="phone" size={24} color="#50703C"/>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Phone</Text>
                    <Text style={styles.cardValue}>{phoneNumber || 'No phone number provided'}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoCards: {
        marginBottom: 12,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default InfoCards;
