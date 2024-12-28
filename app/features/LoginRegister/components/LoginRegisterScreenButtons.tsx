import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons'; // Ensure @expo/vector-icons is installed
import {scaleFont} from '@/app/utils/ResponsiveFont';

const GoogleSignInButton: React.FC = () => (
    <TouchableOpacity style={styles.button}>
        <FontAwesome name="google" size={scaleFont(20)} color="black" style={styles.icon}/>
        <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
);

const PhoneSignInButton: React.FC = () => (
    <View style={styles.button}>
        <FontAwesome name="phone" size={scaleFont(20)} color="black" style={styles.icon}/>
        <Text style={styles.buttonText}>Sign in with Phone</Text>
    </View>
);

const EmailSignInButton: React.FC = () => (
    <View style={styles.button}>
        <FontAwesome name="envelope" size={scaleFont(20)} color="black" style={styles.icon}/>
        <Text style={styles.buttonText}>Sign in with Email</Text>
    </View>
);

const styles = StyleSheet.create({
    button: {
        height: scaleFont(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: scaleFont(16),
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(20),
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: scaleFont(5),
        elevation: 5, // Android shadow
        width: '100%', // Adjust width as needed
        alignSelf: 'center', // Center the button itself
        marginTop: scaleFont(10), // Consistent spacing between buttons
    },
    icon: {
        marginRight: scaleFont(8), // Space between icon and text
    },
    buttonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: scaleFont(20), // Adjust font size for uniformity
        color: 'black',
    },
});

export {GoogleSignInButton, PhoneSignInButton, EmailSignInButton};
