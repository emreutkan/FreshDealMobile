import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";

interface InputFieldProps {
    value: string;
    onChange: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'visible-password';
    secureTextEntry?: boolean;
    borderColor?: string
}

const InputField: React.FC<InputFieldProps> = ({
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   keyboardType = 'default',
                                                   secureTextEntry = false, borderColor
                                               }) => {
    const [isTyping, setIsTyping] = useState<boolean>(!!value);

    const handleTextChange = (text: string) => {
        onChange(text);

        if (text.length === 0) {
            setIsTyping(false);
        } else {
            setIsTyping(true);
        }
    };

    const handleClearText = () => {
        onChange('');
        setIsTyping(false);
    };

    return (
        <View style={[styles.inputContainer, {borderColor: borderColor}, isTyping && {borderColor: 'gray'}]}>
            <TextInput
                style={styles.inputText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                keyboardType={keyboardType}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={handleTextChange}
                onFocus={() => console.log(`${placeholder} Input Focused`)}
            />
            {isTyping && (
                <TouchableOpacity onPress={handleClearText} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
            )}
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
        flex: 1,
        height: scaleFont(50),
    },
    inputText: {
        marginLeft: scaleFont(10),
        flex: 1,
        fontSize: scaleFont(14),
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

export default InputField;
