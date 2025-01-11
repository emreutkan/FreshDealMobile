// src/features/LoginRegister/components/VerificationCodeInputField.tsx
import React from "react";
import {StyleSheet, TextInput} from "react-native";
import {scaleFont} from "@/src/utils/ResponsiveFont";

interface VerificationCodeInputFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const VerificationCodeInputField: React.FC<VerificationCodeInputFieldProps> = ({
                                                                                   value,
                                                                                   onChangeText,
                                                                                   placeholder,
                                                                                   keyboardType = "numeric",
                                                                               }) => {
    return (
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            maxLength={6}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: scaleFont(50),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: scaleFont(10),
        fontSize: scaleFont(16),
        backgroundColor: "#fff",
    },
});

export default VerificationCodeInputField;
