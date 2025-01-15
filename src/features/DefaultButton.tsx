import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react'
import {scaleFont} from '@/src/utils/ResponsiveFont';

interface LoginButtonProps {
    onPress: () => void;
    title?: string;
    children?: React.ReactNode; // in case if you add something inside later  
    style?: ViewStyle; // Add this line

}

const DefaultButton: React.FC<LoginButtonProps> = ({
                                                       onPress,
                                                       title = 'Login',
                                                       children,

                                                   }) => {
    return (
        <TouchableOpacity style={[styles.button]} onPress={onPress}>
            <Text style={styles.buttonText}>
                {title}
                {children}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: scaleFont(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#b0f484',
        borderRadius: scaleFont(16),
        paddingVertical: scaleFont(12),
        paddingHorizontal: scaleFont(24),
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: scaleFont(4),
        elevation: 5, // Android shadow
        alignSelf: 'center',
        fontFamily: 'Poppins-Regular',
    },
    buttonText: {
        color: '#000',
        fontSize: scaleFont(18),
        fontFamily: 'Poppins-Regular',

    },
});

export default DefaultButton;