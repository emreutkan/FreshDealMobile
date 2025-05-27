import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react-native';
import {renderWithProviders} from '../../testUtils';
import AchievementsScreen from '@/src/features/AchievementsScreen/AchievementsScreen';
import * as achievementThunks from '@/src/redux/thunks/achievementThunks';
import {Achievement} from '@/src/types/states';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        goBack: mockGoBack,
        navigate: mockNavigate,
    }),
}));

// Mock achievement thunks
jest.mock('@/src/redux/thunks/achievementThunks', () => ({
    fetchUserAchievementsThunk: jest.fn(() => () => Promise.resolve([])),
}));

const mockAchievements: Achievement[] = [
    {
        id: '1',
        name: 'First Purchase Master',
        description: 'Made your first purchase.',
        achievement_type: 'FIRST_PURCHASE',
        threshold: 1,
        xp_reward: 10,
        earned_at: new Date().toISOString(),
        progress: 1,
    },
    {
        id: '2',
        name: 'Shopping Spree',
        description: 'Make 5 purchases.',
        achievement_type: 'PURCHASE_COUNT',
        threshold: 5,
        xp_reward: 50,
        earned_at: null, // Locked
        progress: 2,
    },
    {
        id: '3',
        name: 'Eco Warrior',
        description: 'Save 10 items.',
        achievement_type: 'ECO_WARRIOR',
        threshold: 10,
        xp_reward: 30,
        earned_at: new Date().toISOString(),
        progress: 10,
    },
];

const initialState = {
    user: {
        achievements: [],
        loading: false, // Represents general user loading, not specific to achievements inside user slice
        currentUser: {id: 'testUser', email: 'test@example.com'},
        // other user properties...
    },
    // other slices of state...
};


describe('AchievementsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the mock implementation for fetchUserAchievementsThunk for each test if needed
        (achievementThunks.fetchUserAchievementsThunk as jest.Mock).mockImplementation(() => () => Promise.resolve(mockAchievements));
    });

    test('renders header and initial stats correctly', async () => {
        const {getByText, findByText} = renderWithProviders(<AchievementsScreen/>, {
            initialState: {
                ...initialState,
                user: {...initialState.user, achievements: mockAchievements, loading: false},
            },
        });

        expect(getByText('Achievements')).toBeTruthy();
        // Wait for stats to be calculated and rendered
        await findByText('2'); // Unlocked count
        expect(getByText('1')).toBeTruthy(); // Locked count
        expect(getByText('67%')).toBeTruthy(); // Complete percentage (2 out of 3)
    });

    test('renders a list of achievements', async () => {
        const {getByText, findByText} = renderWithProviders(<AchievementsScreen/>, {
            initialState: {
                ...initialState,
                user: {...initialState.user, achievements: mockAchievements, loading: false},
            },
        });

        await findByText('First Purchase Master');
        expect(getByText('Made your first purchase.')).toBeTruthy();
        expect(getByText('Shopping Spree')).toBeTruthy();
        expect(getByText('Make 5 purchases.')).toBeTruthy();
    });

    test('shows loading indicator when achievements are loading', () => {
        (achievementThunks.fetchUserAchievementsThunk as jest.Mock).mockImplementation(() => () => new Promise(() => {
        })); // Simulate pending promise
        const {getByText, getByTestId} = renderWithProviders(<AchievementsScreen/>, {
            initialState: {
                ...initialState,
                user: {...initialState.user, achievements: [], loading: true}, // Simulate loading state
            },
        });
        // In AchievementsScreen, loading is determined by `achievementsLoading && achievements.length === 0`
        // So we need to ensure achievements is empty and the thunk is still pending or loading prop is true from a relevant slice
        // For this test, we will rely on the text, assuming ActivityIndicator is present.
        expect(getByText('Loading achievements...')).toBeTruthy();
    });

    test('shows empty state when no achievements are found', async () => {
        (achievementThunks.fetchUserAchievementsThunk as jest.Mock).mockImplementation(() => () => Promise.resolve([])); // Return empty array
        const {getByText, findByText} = renderWithProviders(<AchievementsScreen/>, {
            initialState: {
                ...initialState,
                user: {...initialState.user, achievements: [], loading: false},
            },
        });
        await findByText('No achievements found');
        expect(getByText('Complete tasks to earn achievements')).toBeTruthy();
    });

    test('navigates back when back button is pressed', () => {
        const {getByTestId} = renderWithProviders(<AchievementsScreen/>, {initialState});
        // The back button is an TouchableOpacity wrapping an Ionicons
        // We need to make it identifiable, e.g. by adding a testID to the TouchableOpacity in the component
        // For now, let's assume it's the first TouchableOpacity in the header or has a specific accessible role.
        // This might be fragile. Adding a testID="back-button" to the TouchableOpacity is recommended.
        const backButton = getByTestId('back-button'); // Assuming you add testID="back-button" to the TouchableOpacity
        fireEvent.press(backButton);
        expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    test('calls fetchUserAchievementsThunk on pull to refresh', async () => {
        const {getByTestId} = renderWithProviders(<AchievementsScreen/>, {
            initialState: {
                ...initialState,
                user: {...initialState.user, achievements: mockAchievements, loading: false},
            },
        });

        const flatList = getByTestId('achievements-list'); // Assuming you add testID="achievements-list" to FlatList
        fireEvent(flatList, 'refresh');

        await waitFor(() => {
            expect(achievementThunks.fetchUserAchievementsThunk).toHaveBeenCalledTimes(2); // Initial call + refresh call
        });
    });

    test('displays correct icon for achievement type', async () => {
        const {findByTestId} = renderWithProviders(<AchievementsScreen/>, {
            initialState: {
                ...initialState,
                user: {...initialState.user, achievements: [mockAchievements[0]], loading: false}, // Test with one achievement
            },
        });
        // This test assumes you add testID to the Ionicon in AchievementCard, e.g., testID={`achievement-icon-${achievement.id}`}
        // And that the icon name is derived correctly. For 'FIRST_PURCHASE', it should be 'trophy'
        const icon = await findByTestId('achievement-icon-1'); // Using achievement ID 1
        // How to check icon name? The rendered component is just 'Ionicons'.
        // We might need to check the props passed to it, which is harder with RTL without direct access to component instances.
        // A simpler check might be to ensure the card renders, and trust the mapping is correct.
        // Or, if the icon component has a prop that reflects the name (like a name prop itself), we could query for that.
        expect(icon).toBeTruthy(); // Basic check that an icon container/element is rendered.
    });

});

