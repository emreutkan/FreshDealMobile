import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';

const loginPage: React.FC = () => {

    const [phoneLogin, setPhoneLogin] = useState<boolean>(true);



    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.bottomContainer}>
                <Text style={styles.welcomeText}>Last Call,</Text>
                <Text style={styles.welcomeText2}>Tasty Deals Await!</Text>

            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    bottomContainer: {
        flex: 1,
        paddingHorizontal: 35,
    },
    welcomeText: {
        fontSize: 35,
        textAlign: 'center',
        color: '#000000',
        marginTop: 20,
        marginBottom: 5,
    },
    welcomeText2: {
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 20,
        color: '#50703C',
    },

});

export default loginPage;
