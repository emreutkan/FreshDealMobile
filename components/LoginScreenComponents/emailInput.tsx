import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Text, Keyboard } from 'react-native';
import {scaleFont} from "@/utils/ResponsiveFont";
import {UserModel} from "@/models/UserModel";
import PasswordInputSingleton from './passwordInputSingleton'; // Import your password input component

const EmailLoginField: React.FC = () => {
    const user = UserModel.getInstance();
    const [email, setEmail] = useState<string>(user.getEmail() || '');
    const [isTyping, setIsTyping] = useState<boolean>(!!email);
    const passwordInputInstance = PasswordInputSingleton.getInstance();

    const handleEmailChange = (text: string) => {
        setEmail(text);
        user.setEmail(text);
        if (text.length == 0) {
            setIsTyping(false)
            handleClearText()
        }
        else {
            setIsTyping(true)
            console.log(user.getPassword() + 'password from email input handleemailchange')

            user.getPhoneNumber().length == 0 && user.getEmail().length == 0 ? passwordInputInstance.setVisible(false) : passwordInputInstance.setVisible(true);

        }

    };

    const handleClearText = () => {
        setEmail('');
        user.setEmail('');
        setIsTyping(false);

        /**
         * this logic makes it so that if email and phone number input are in the same view (like registration screen) then clicking on the clearText icon wont close the password field if one of the fields have text in them
         * also if user types password then it wont dissapear too
         */
        console.log(user.getPassword() + 'password from email input handleClearText')
        user.getPassword().length == 0 && user.getPhoneNumber().length == 0 && user.getEmail().length == 0 ? passwordInputInstance.setVisible(false) : passwordInputInstance.setVisible(true);

        // user.setPassword('');
        /*
        * removed this line to allow this scenario to happen:
        *
        * user tries to login with phone number and enters the password then decides to login with email (or phone) instead
        *
        * and goes on with clicking X button to clear phone number then clicks login with email (or phone) button after that
        *
        * password that was entered will consistent
        *
        * if you uncomment it then password will reset
        *
        * */



    };

    return (
        <View>
            <View style={[styles.inputContainer, isTyping && { borderColor: 'gray' }]}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={handleEmailChange}
                    onFocus={() => console.log("Email Input Focused")}
                />
                {isTyping && (
                    <TouchableOpacity onPress={handleClearText} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>X</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: scaleFont(16),
        paddingHorizontal: scaleFont(15),
        backgroundColor: '#fff',
        width: '100%',
        height: scaleFont(50),
    },
    inputText: {
        marginLeft: scaleFont(10),
        flex: 1,
        fontSize: scaleFont(17),
        color: '#1a1818',
        fontFamily: 'Poppins-Regular',
    },
    clearButton: {
        paddingHorizontal: scaleFont(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#999',
        fontSize: scaleFont(16),
    },
});

export default EmailLoginField;
