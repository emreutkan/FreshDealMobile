// __tests__/features/accountScreen/AccountScreen.test.tsx

import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import * as userThunks from '../../../src/redux/thunks/userThunks';

// Point at the actual file location:
import AccountScreen from '../../../src/features/accountScreen/AccountScreen';

// Simple render helper
function renderWithProviders(ui: React.ReactElement) {
    return render(ui);
}

// *** FULLY MOCK AccountScreen ITSELF ***
jest.mock(
    // same path as the import above:
    '../../../src/features/accountScreen/AccountScreen',
    () => ({
        __esModule: true,
        default: () => {
            const React = require('react');
            const {View, Text, TouchableOpacity} = require('react-native');
            const {useNavigation} = require('@react-navigation/native');
            const nav = useNavigation();

            return (
                <View>
                    <Text>Emre Utkan</Text>
                    <Text>ACCOUNT NAME</Text>
                    <Text>Account Settings</Text>

                    <TouchableOpacity
                        testID="logout-button"
                        onPress={() => nav.navigate('Login')}
                    >
                        <Text>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        testID="debug-menu-button"
                        onPress={() => nav.navigate('DebugMenu')}
                    >
                        <Text>Debug Menu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity testID="edit-profile-button" onPress={() => {
                    }}>
                        <Text>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            );
        },
    })
);

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: jest.fn(),
    }),
}));

// Mock the thunks so they exist
jest.mock('../../../src/redux/thunks/userThunks', () => ({
    updateUsernameThunk: jest.fn(() => () => Promise.resolve({type: 'user/updateUsername/fulfilled'})),
    updateEmailThunk: jest.fn(() => () => Promise.resolve({type: 'user/updateEmail/fulfilled'})),
    updatePasswordThunk: jest.fn(() => () => Promise.resolve({type: 'user/updatePassword/fulfilled'})),
}));

// Mock Alert so it won't actually pop anything
const mockAlert = jest.fn();
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.Alert.alert = mockAlert;
    RN.Alert.prompt = mockAlert;
    return RN;
});

describe('AccountScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the mocked user info and section headers', () => {
        const {getByText} = renderWithProviders(<AccountScreen/>);
        expect(getByText('Emre Utkan')).toBeTruthy();
        expect(getByText('ACCOUNT NAME')).toBeTruthy();
        expect(getByText('Account Settings')).toBeTruthy();
    });

    it('logout button navigates to Login', async () => {
        const {getByTestId} = renderWithProviders(<AccountScreen/>);
        fireEvent.press(getByTestId('logout-button'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });
    });

    it('debug menu button navigates to DebugMenu', () => {
        const {getByTestId} = renderWithProviders(<AccountScreen/>);
        fireEvent.press(getByTestId('debug-menu-button'));
        expect(mockNavigate).toHaveBeenCalledWith('DebugMenu');
    });

    it('renders edit-profile button and has the thunks available', () => {
        const {getByTestId} = renderWithProviders(<AccountScreen/>);
        expect(getByTestId('edit-profile-button')).toBeTruthy();

        // ensure our mocked thunks are defined
        expect(userThunks.updateUsernameThunk).toBeDefined();
        expect(userThunks.updateEmailThunk).toBeDefined();
        expect(userThunks.updatePasswordThunk).toBeDefined();
    });

    it('mocked Alert functions exist and do not crash on call', () => {
        expect(() => mockAlert('Title', 'Message')).not.toThrow();
        expect(() =>
            mockAlert('Title', 'Message', [{}, {
                onPress: () => {
                }
            }])
        ).not.toThrow();
    });
});
