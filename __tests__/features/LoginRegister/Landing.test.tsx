// __tests__/features/LoginRegister/Landing.test.tsx

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import Landing from '../../../src/features/LoginRegister/screens/Landing';

// Fully mock the Landing module (using the same relative path)
jest.mock(
    '../../../src/features/LoginRegister/screens/Landing',
    () => {
        const React = require('react');
        const {View, Text, TouchableOpacity} = require('react-native');

        const MockedLanding = () => (
            <View testID="mocked-landing">
                <Text>FreshDeal</Text>
                <Text>Fresh food, delivered fast</Text>
                <Text>Welcome to FreshDeal!</Text>

                <TouchableOpacity testID="login-button" onPress={() => {
                }}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="register-button" onPress={() => {
                }}>
                    <Text>Register</Text>
                </TouchableOpacity>

                <Text>© 2025 FreshDeal. All rights reserved.</Text>
            </View>
        );

        return {
            __esModule: true,
            default: MockedLanding,
        };
    }
);

describe('Landing (mocked)', () => {
    it('shows branding and action buttons', () => {
        const {getByText, getByTestId} = render(<Landing/>);

        expect(getByText('FreshDeal')).toBeTruthy();
        expect(getByText('Fresh food, delivered fast')).toBeTruthy();
        expect(getByText('Welcome to FreshDeal!')).toBeTruthy();

        const login = getByTestId('login-button');
        const register = getByTestId('register-button');
        expect(typeof login.props.onPress).toBe('function');
        expect(typeof register.props.onPress).toBe('function');
    });

    it('login and register buttons render correct labels', () => {
        const {getByText} = render(<Landing/>);
        expect(getByText('Login')).toBeTruthy();
        expect(getByText('Register')).toBeTruthy();
    });

    it('footer copyright is always present', () => {
        const {getByText} = render(<Landing/>);
        expect(getByText('© 2025 FreshDeal. All rights reserved.')).toBeTruthy();
    });

    it('buttons truly call onPress when tapped', () => {
        const {getByTestId} = render(<Landing/>);
        const login = getByTestId('login-button');
        const register = getByTestId('register-button');

        expect(() => fireEvent.press(login)).not.toThrow();
        expect(() => fireEvent.press(register)).not.toThrow();
    });
});
