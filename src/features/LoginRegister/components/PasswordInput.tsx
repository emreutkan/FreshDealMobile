import React, {useEffect, useRef, useState} from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {useDispatch} from "react-redux";
import {setPassword} from "@/src/redux/slices/userSlice";

const PasswordInput: React.FC<{ password: string }> = ({password}) => {
    const dispatch = useDispatch();
    const [isTyping, setIsTyping] = useState<boolean>(password.length > 0); // Track if user is typing
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const animatedLabel = useRef(new Animated.Value(password ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedLabel, {
            toValue: isFocused || !!password ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, password]);

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
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleLabelPress = () => {
        inputRef.current?.focus();
    };
    // Handle changes in the password input
    const handlePasswordChange = (value: string) => {
        dispatch(setPassword(value)); // Update password in Redux
        setIsTyping(value.length > 0); // Set typing state based on input length
    };

    // Clear the password input
    const handleClearPassword = () => {
        dispatch(setPassword('')); // Clear Redux state
        setIsTyping(false); // Update typing state
    };


    useEffect(() => {
        console.log('Password:', password);
        if (password) {
            setIsTyping(true);
        }
    }, [password]);
    return (
        <View style={[styles.inputContainer, isFocused && {borderColor: 'gray'}]}>
            <TouchableWithoutFeedback onPress={handleLabelPress}>
                <Animated.Text style={[styles.label, labelStyle]}>
                    Enter your Password
                </Animated.Text>
            </TouchableWithoutFeedback>
            <TextInput
                ref={inputRef}
                style={styles.passwordInput}
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange} // Update input on text change
                autoCapitalize="none"
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {isTyping && (
                <TouchableOpacity onPress={handleClearPassword} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        // marginTop: scaleFont(10),
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
    passwordInput: {
        flex: 1,
        fontSize: scaleFont(16),
        color: '#333',
        fontFamily: Platform.OS === 'android' ? 'Poppins' : 'Poppins-Regular',
        paddingVertical: scaleFont(10),

    },
    clearButton: {
        paddingHorizontal: scaleFont(10),
        paddingVertical: scaleFont(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#999',
        fontSize: scaleFont(16),
    },
    label: {
        position: 'absolute',
        left: scaleFont(15),
        zIndex: 1,
    },
});

export default PasswordInput;
