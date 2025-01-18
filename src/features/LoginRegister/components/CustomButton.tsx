// components/CustomButton.tsx
import React from 'react';
import {ActivityIndicator, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ButtonStyles} from "@/src/styles/ButtonStyles";

interface CustomButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'default' | 'green';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
                                                              onPress,
                                                              title,
                                                              variant = 'default',
                                                              disabled = false,
                                                              loading = false,
                                                              icon,
                                                              style,
                                                              textStyle,
                                                          }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                variant === 'default' ? ButtonStyles.default : ButtonStyles.defaultGreenButton,
                disabled && {opacity: 0.5},
                style
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'default' ? '#50703C' : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <>
                    {icon && <View style={ButtonStyles.ButtonIcon}>{icon}</View>}
                    <Text style={[
                        ButtonStyles.ButtonText,
                        variant === 'green' && {color: '#FFFFFF'},
                        textStyle
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};