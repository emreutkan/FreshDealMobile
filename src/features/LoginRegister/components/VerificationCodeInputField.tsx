// src/features/LoginRegister/components/VerificationCodeInputField.tsx
import React, {useRef} from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {scaleFont} from "@/src/utils/ResponsiveFont";

interface VerificationCodeInputFieldProps {
    value: string;
    onChangeText: (text: string) => void;
}

const VerificationCodeInputField: React.FC<VerificationCodeInputFieldProps> = ({
                                                                                   value,
                                                                                   onChangeText,
                                                                               }) => {
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleTextChange = (text: string, index: number) => {
        const newValue = value.split("");
        newValue[index] = text;
        onChangeText(newValue.join(""));

        // Move to the next input if text is entered
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        // Move to the previous input if backspace is pressed
        if (!text && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array.from({length: 6}).map((_, index) => (
                <React.Fragment key={index}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.input}
                            value={value[index] || ""}
                            onChangeText={(text) => handleTextChange(text, index)}
                            maxLength={1}
                            keyboardType="numeric"
                        />
                        <View style={styles.underline}/>
                    </View>
                    {/* Add separator between groups */}
                    {index === 2 && <Text style={styles.separator}>-</Text>}
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: scaleFont(20),
        // marginBottom: scaleFont(10),
    },
    inputContainer: {
        alignItems: "center",
        marginHorizontal: scaleFont(5),
    },
    input: {
        fontSize: scaleFont(20),
        color: "#333", // Darker text color
        textAlign: "center",
        marginBottom: scaleFont(6), // Space above underline
        width: scaleFont(40), // Increased width for better visibility
        height: scaleFont(50), // Added height for better usability
        borderWidth: 1,
        borderColor: "#666", // Slightly darker border for focus
        borderRadius: scaleFont(5),
        backgroundColor: "#f5f5f5", // Light background for contrast
    },
    underline: {
        height: scaleFont(2),
        width: scaleFont(30),
        backgroundColor: "#333", // Dark underline
    },
    separator: {
        fontSize: scaleFont(20),
        color: "#333", // Dark separator
        marginHorizontal: scaleFont(10),
    },
});

export default VerificationCodeInputField;
