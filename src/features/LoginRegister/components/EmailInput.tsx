import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useDispatch, useSelector} from 'react-redux';
import {setEmail} from '@/src/redux/slices/userSlice'; // Adjust the path as needed
import {RootState} from '@/src/redux/store'; // Adjust the path as needed

const EmailLoginField: React.FC = () => {
    const dispatch = useDispatch();
    const email = useSelector((state: RootState) => state.user.email);
    const [isFocused, setIsFocused] = useState(false);
    const animatedLabel = useRef(new Animated.Value(email ? 1 : 0)).current;
    const inputRef = useRef<TextInput>(null);

    const handleEmailChange = (text: string) => {
        dispatch(setEmail(text));
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    useEffect(() => {
        Animated.timing(animatedLabel, {
            toValue: isFocused || !!email ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, email]);

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
        <View style={styles.container}>
            <View style={[styles.inputContainer, isFocused && {borderColor: 'gray'}]}>
                <TouchableWithoutFeedback onPress={handleLabelPress}>
                    <Animated.Text style={[styles.label, labelStyle]}>
                        Enter your email
                    </Animated.Text>
                </TouchableWithoutFeedback>
                <TextInput
                    ref={inputRef}
                    style={styles.inputText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={handleEmailChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {email && (
                    <TouchableOpacity
                        onPress={() => dispatch(setEmail(''))}
                        style={styles.clearButton}
                    >
                        <Text style={styles.clearButtonText}>X</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
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

export default EmailLoginField;
