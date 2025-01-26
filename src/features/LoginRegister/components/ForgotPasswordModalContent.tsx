import React, {memo, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import {CustomButton} from "@/src/features/LoginRegister/components/CustomButton";
import {MaterialIcons} from "@expo/vector-icons";
import BaseInput from "@/src/features/LoginRegister/components/BaseInput";
import {scaleFont} from "@/src/utils/ResponsiveFont";

// Create a separate component for the forgot password modal
const ForgotPasswordModalContent = memo(({
                                             isVisible,
                                             onClose,
                                             onSubmit
                                         }: {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
}) => {
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!forgotPasswordEmail) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(forgotPasswordEmail);
            setForgotPasswordEmail('');
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to send reset instructions'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View style={styles.forgotPasswordModal}>
                            <Text style={styles.forgotPasswordTitle}>Reset Password</Text>
                            <Text style={styles.forgotPasswordSubtitle}>
                                Enter your email address and we'll send you instructions to reset your password.
                            </Text>

                            <BaseInput
                                value={forgotPasswordEmail}
                                onChangeText={setForgotPasswordEmail}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                leftIcon={<MaterialIcons name="email" size={24} color="#50703C"/>}
                            />

                            <View style={styles.forgotPasswordButtons}>
                                <CustomButton
                                    onPress={onClose}
                                    title="Cancel"
                                    variant="default"
                                    style={{width: '48%'}}
                                />
                                <CustomButton
                                    onPress={handleSubmit}
                                    title="Send"
                                    loading={isSubmitting}
                                    variant="green"
                                    style={{width: '48%'}}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

const styles = StyleSheet.create({

    forgotPasswordModal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    forgotPasswordTitle: {
        fontSize: scaleFont(24),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    forgotPasswordSubtitle: {
        fontSize: scaleFont(14),
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    forgotPasswordButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export const ForgotPasswordModal = ForgotPasswordModalContent;