import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react-native';
import {renderWithProviders} from '../../testUtils';
import AccountScreen from '@/src/features/accountScreen/AccountScreen';
import * as userThunks from '@/src/redux/thunks/userThunks';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ // Return an object that includes goBack
        navigate: mockNavigate,
        goBack: jest.fn(), // Mock goBack as well if it's used by any child components or the screen itself
    }),
}));

// Mock thunks
jest.mock('@/src/redux/thunks/userThunks', () => ({
    updateUsernameThunk: jest.fn(() => () => Promise.resolve({type: 'user/updateUsername/fulfilled'})),
    updateEmailThunk: jest.fn(() => () => Promise.resolve({type: 'user/updateEmail/fulfilled'})),
    updatePasswordThunk: jest.fn(() => () => Promise.resolve({type: 'user/updatePassword/fulfilled'})),
    // Add other thunks if used directly by AccountScreen or its direct children being tested
}));
jest.mock('@/src/redux/thunks/achievementThunks', () => ({
    fetchUserAchievementsThunk: jest.fn(() => () => Promise.resolve([])),
}));

// Mock userSlice actions like logout
jest.mock('@/src/redux/slices/userSlice', () => ({
    ...jest.requireActual('@/src/redux/slices/userSlice'), // keep other exports from the slice
    logout: jest.fn(), // Mock the logout action creator
}));

// Mock Alert
const mockAlert = jest.fn();
const mockAlertPrompt = jest.fn();

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.Alert.alert = mockAlert;
    RN.Alert.prompt = mockAlertPrompt;
    return RN;
});

const mockInitialState = {
    user: {
        name_surname: 'Test User',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        token: 'mock-token',
        loading: false,
        achievements: [], // Ensure achievements is part of the mock user state
        // ... other user properties
    },
    // ... other store slices
};

describe('AccountScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock for Alert.alert confirmation (e.g., user presses "Logout" or "Save")
        mockAlert.mockImplementation((title, message, buttons) => {
            if (buttons && buttons.length > 1 && buttons[1].text === 'Logout') {
                buttons[1].onPress(); // Simulate pressing the "Logout" button
            }
            if (buttons && buttons.length > 1 && buttons[1].text === 'Save') {
                buttons[1].onPress(); // Simulate pressing the "Save" button
            }
        });
    });

    test('renders profile information and action section titles', () => {
        const {getByText} = renderWithProviders(<AccountScreen/>, {initialState: mockInitialState});

        expect(getByText('Test User')).toBeTruthy(); // From ProfileSection
        expect(getByText('ACCOUNT NAME')).toBeTruthy(); // Label from ProfileSection
        expect(getByText('Account Settings')).toBeTruthy(); // Title from ActionsSection
    });

    test('handles logout correctly', async () => {
        const {getByText} = renderWithProviders(<AccountScreen/>, {initialState: mockInitialState});

        const logoutButton = getByText('Logout');
        fireEvent.press(logoutButton);

        // Alert.alert is mocked to auto-confirm by calling the second button's onPress
        await waitFor(() => {
            // Check if logout action was dispatched (more reliable than checking slice directly in some cases)
            // This requires your logout action creator to be imported or to check navigation
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });
        // Optionally, check if the state reflects logout if your logout action modifies the store in a verifiable way
        // For example, if token becomes null:
        // expect(store.getState().user.token).toBeNull();
    });

    test('navigates to Debug Menu when "Debug Menu" button is pressed', () => {
        const {getByText} = renderWithProviders(<AccountScreen/>, {initialState: mockInitialState});

        const debugMenuButton = getByText('Debug Menu');
        fireEvent.press(debugMenuButton);

        expect(mockNavigate).toHaveBeenCalledWith('DebugMenu');
    });

    test('enters edit mode, changes name, and saves', async () => {
        const {getByText, getByPlaceholderText} = renderWithProviders(
            <AccountScreen/>, {initialState: mockInitialState});

        // 1. Click "Edit Profile" to enter edit mode
        const editProfileButton = getByText('Edit Profile');
        fireEvent.press(editProfileButton);

        // 2. Verify it's in edit mode (button text changes to "Save Profile")
        expect(getByText('Save Profile')).toBeTruthy();

        // 3. Change the name in TextInput
        // ProfileSection uses 'Full Name' as placeholder for the name input
        const nameInput = getByPlaceholderText('Full Name');
        fireEvent.changeText(nameInput, 'Updated Name');

        // 4. Click "Save Profile"
        const saveProfileButton = getByText('Save Profile');
        fireEvent.press(saveProfileButton);

        // Alert.alert is mocked to auto-confirm save
        await waitFor(() => {
            expect(userThunks.updateUsernameThunk).toHaveBeenCalledWith({username: 'Updated Name'});
        });

        // 5. Verify success alert (optional, if you want to check Alert.alert calls directly)
        // mockAlert was called for save confirmation, then potentially for success/error
        // Check for the success message specifically if needed.
        // For example: expect(mockAlert).toHaveBeenCalledWith('Success', 'Profile updated successfully');

        // 6. Verify it exits edit mode (button text changes back to "Edit Profile")
        // This requires the component to reset isEditing state after successful save
        // await waitFor(() => expect(getByText('Edit Profile')).toBeTruthy());
    });

    // Add more tests for password reset, email change, view achievements etc.

});

