import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { scaleFont } from '../utils/ResponsiveFont';
import { UserModel } from '@/models/UserModel';

class PasswordInputSingleton {
    private static instance: PasswordInputSingleton;
    private isVisible: boolean = false; // Control visibility
    private setVisibilityCallback: ((visible: boolean) => void) | null = null;

    private constructor() {}

    // Singleton instance accessor
    public static getInstance(): PasswordInputSingleton {
        if (!PasswordInputSingleton.instance) {
            PasswordInputSingleton.instance = new PasswordInputSingleton();
        }
        return PasswordInputSingleton.instance;
    }

    // Method to control visibility of the component
    public setVisible(visible: boolean) {
        this.isVisible = visible;
        if (this.setVisibilityCallback) {
            this.setVisibilityCallback(visible);
        }
    }

    // React Functional Component for rendering
    public getComponent(): React.FC {
        return () => {
            const user = UserModel.getInstance();
            const [password, setPassword] = useState<string>(user.getPassword() || '');
            const [visible, setVisible] = useState<boolean>(PasswordInputSingleton.instance.isVisible);

            // Assign the visibility control callback
            PasswordInputSingleton.instance.setVisibilityCallback = setVisible;

            const handlePasswordChange = (text: string) => {
                setPassword(text);
                user.setPassword(text); // Update UserModel instance
            };

            if (!visible) {
                return null; // Render nothing if not visible
            }

            return (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={handlePasswordChange}
                    />
                </View>
            );
        };
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: scaleFont(10),
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: scaleFont(16),
        paddingHorizontal: scaleFont(15),
        backgroundColor: '#fff',
        width: '100%',
        height: scaleFont(50),
    },
    passwordInput: {
        fontSize: scaleFont(16),
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
});

export default PasswordInputSingleton;
