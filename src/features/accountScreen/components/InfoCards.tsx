import React from 'react';
import {Animated, StyleSheet, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

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
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        if (isEditing) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.03,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [isEditing]);

    return (
        <Animated.View
            style={[
                styles.infoCards,
                {transform: [{scale: scaleAnim}]}
            ]}
        >
            <View style={styles.sectionHeader}>
                <Ionicons name="information-circle-outline" size={20} color="#50703C"/>
                <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardIcon}>
                    <Ionicons name="mail-outline" size={22} color="#50703C"/>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Email Address</Text>
                    {isEditing ? (
                        <TextInput
                            style={[styles.cardValue, styles.input]}
                            value={editedValues.email}
                            onChangeText={(text) => setEditedValues({...editedValues, email: text})}
                            keyboardType="email-address"
                            placeholder="Enter your email"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />
                    ) : (
                        <Text style={styles.cardValue}>{email || 'No email provided'}</Text>
                    )}
                </View>
            </View>

            <View style={[styles.card, styles.lastCard]}>
                <View style={styles.cardIcon}>
                    <Ionicons name="call-outline" size={22} color="#50703C"/>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Phone Number</Text>
                    <Text style={styles.cardValue}>{phoneNumber || 'No phone number provided'}</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    infoCards: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginLeft: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    lastCard: {
        borderBottomWidth: 0,
    },
    cardIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(80, 112, 60, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    cardValue: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Medium',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default InfoCards;