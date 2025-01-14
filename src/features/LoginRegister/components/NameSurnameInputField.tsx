import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useDispatch, useSelector} from 'react-redux';
import {setName} from '@/src/redux/slices/userSlice'; // Adjust the path as needed
import {RootState} from '@/src/redux/store'; // Adjust the path as needed

const NameSurnameInputField: React.FC = () => {
    const dispatch = useDispatch();
    const fullName = useSelector((state: RootState) => state.user.name_surname); // Single name field from Redux

    const [inputValue, setInputValue] = useState<string>(fullName); // Local input state
    const [isTyping, setIsTyping] = useState<boolean>(inputValue.length > 0);
    const [isFocused, setIsFocused] = useState(false);
    const animatedLabel = useRef(new Animated.Value(fullName ? 1 : 0)).current;
    const inputRef = useRef<TextInput>(null);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);


    useEffect(() => {
        // Sync with Redux store if it changes
        setInputValue(fullName);
    }, [fullName]);
    useEffect(() => {
        Animated.timing(animatedLabel, {
            toValue: isFocused || !!fullName ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, fullName]);

    const handleTextChange = (text: string) => {
        // Remove any non-letter characters except for spaces
        const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
        setInputValue(cleanedText);

        if (cleanedText.length === 0) {
            setIsTyping(false);
            dispatch(setName(''));
        } else {
            setIsTyping(true);
            dispatch(setName(cleanedText)); // Update Redux store with a single string
        }
    };

    const handleClearText = () => {
        setInputValue('');
        setIsTyping(false);
        dispatch(setName(''));
    };
    const labelStyle = {
        top: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [scaleFont(15), scaleFont(0)],
        }),
        fontSize: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [scaleFont(16), scaleFont(12)],
        }),
        color: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: ['#999', 'gray'],
        }),
    };

    const handleLabelPress = () => {
        inputRef.current?.focus();
    };
    return (
        <View>
            <View style={[styles.inputContainer, isTyping && {borderColor: 'gray'}]}>
                <TouchableWithoutFeedback onPress={handleLabelPress}>
                    <Animated.Text style={[styles.label, labelStyle]}>
                        Enter your name
                    </Animated.Text>
                </TouchableWithoutFeedback>
                <TextInput
                    ref={inputRef}
                    style={styles.inputText}
                    placeholderTextColor="#999"

                    value={inputValue}
                    onChangeText={handleTextChange}
                    autoCapitalize="words"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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
        flex: 1,
        fontSize: scaleFont(16),
        color: '#1a1818',
        fontFamily: 'Poppins-Regular',
        paddingTop: scaleFont(10),
    },
    label: {
        position: 'absolute',
        left: scaleFont(15),
        zIndex: 1,
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
