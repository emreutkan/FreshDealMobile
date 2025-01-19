// styles/ButtonStyles.ts
import {Platform, StyleSheet, TextStyle, ViewStyle} from 'react-native';

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
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
        width: '100%',
        alignSelf: 'center',
        marginTop: 14,
    },
    defaultGreenButton: {
        paddingTop: 10,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#50703C',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
        width: '100%',
        alignSelf: 'center',
        marginTop: 14,
    },
    ButtonIcon: {
        marginRight: 8,
    },
    ButtonText: {
        color: '#000',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        textAlign: 'center',
    }
});