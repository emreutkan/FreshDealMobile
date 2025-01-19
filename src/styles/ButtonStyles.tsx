import {StyleSheet, TextStyle, ViewStyle} from "react-native";

export const THEME = {
    colors: {
        primary: 'rgba(76,175,80,0.75)',
        secondary: '#64748b',
        success: '#22c55e',
        error: '#FF5A5F',
        background: '#ffffff',
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        border: '#e2e8f0',
        shadow: 'rgba(0, 0, 0, 0.1)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    }
};

export const LIGHT_THEME = {
    colors: {
        primary: 'rgba(76,175,80,0.75)',
        secondary: '#64748b',
        success: '#22c55e',
        error: '#FF5A5F',
        background: '#ffffff',
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        border: '#e2e8f0',
        shadow: 'rgba(0, 0, 0, 0.1)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    },
};

export const DARK_THEME = {
    colors: {
        primary: 'rgba(76,175,80,0.75)',
        secondary: '#94a3b8',
        success: '#22c55e',
        error: '#FF5A5F',
        background: '#1e293b',
        text: {
            primary: '#ffffff',
            secondary: '#94a3b8',
        },
        border: '#334155',
        shadow: 'rgba(0, 0, 0, 0.3)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    },
};

interface ButtonStylesType {
    default: ViewStyle;
    defaultGreenButton: ViewStyle;
    ButtonIcon: ViewStyle;
    ButtonText: TextStyle;
}

export const ButtonStyles = StyleSheet.create<ButtonStylesType>({
    default: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    defaultGreenButton: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#b0f484',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    ButtonIcon: {
        marginRight: 8,
    },
    ButtonText: {
        color: '#000',
        fontFamily: 'Poppins-Regular',
        fontSize: 21,
    }
});
export const InputStyles = {
    Default: {}
}
