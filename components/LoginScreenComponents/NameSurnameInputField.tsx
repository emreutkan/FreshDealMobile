// components/LoginScreenComponents/NameSurnameInputField.tsx

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import {useDispatch, useSelector} from 'react-redux';
import {setName, setSurname} from '../../store/userSlice'; // Adjust the path as needed
import {RootState} from '../../store/store'; // Adjust the path as needed

const NameSurnameInputField: React.FC = () => {
    const dispatch = useDispatch();
    const name = useSelector((state: RootState) => state.user.name);
    const surname = useSelector((state: RootState) => state.user.surname);

    // Initialize fullName from Redux store
    const [fullName, setFullName] = useState<string>(`${name} ${surname}`.trim());
    const [isTyping, setIsTyping] = useState<boolean>(fullName.length > 0);

    useEffect(() => {
        // Update local fullName state if Redux store changes
        setFullName(`${name} ${surname}`.trim());
    }, [name, surname]);

    const handleTextChange = (text: string) => {
        // Remove any non-letter characters except for spaces
        const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
        setFullName(cleanedText);

        if (cleanedText.length === 0) {
            setIsTyping(false);
            dispatch(setName(''));
            dispatch(setSurname(''));
        } else {
            setIsTyping(true);
            updateReduxStore(cleanedText);
        }
    };

    const updateReduxStore = (fullName: string) => {
        const names = fullName.trim().split(/\s+/);
        const firstName = names.slice(0, -1).join(' ') || names[0] || '';
        const lastName = names.length > 1 ? names[names.length - 1] : '';
        dispatch(setName(firstName));
        dispatch(setSurname(lastName));
    };

    const handleClearText = () => {
        setFullName('');
        setIsTyping(false);
        dispatch(setName(''));
        dispatch(setSurname(''));
    };

    return (
        <View>
            <View style={[styles.inputContainer, isTyping && {borderColor: 'gray'}]}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={handleTextChange}
                    onFocus={() => console.log("Name Input Focused")}
                    autoCapitalize="words"
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
    input: {
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

export default NameSurnameInputField;
