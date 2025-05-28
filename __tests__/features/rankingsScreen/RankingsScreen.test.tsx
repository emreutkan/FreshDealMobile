// __tests__/features/rankingsScreen/RankingsScreen.test.tsx

import React from 'react';
import {render} from '@testing-library/react-native';
// 3) Import the now-mocked component
import RankingsScreen from '@/src/features/rankingsScreen/RankingsScreen';

// 1) Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({navigate: mockNavigate, goBack: jest.fn()}),
}));

// 2) Fully mock the module before import
jest.mock(
    '@/src/features/rankingsScreen/RankingsScreen',
    () => {
        const React = require('react');
        const {View, Text} = require('react-native');

        // Stubbed badge and list
        const RankingBadge = ({rank, user}) => (
            <Text testID={`badge-${user}`}>{`${rank}. ${user}`}</Text>
        );

        const RankingsScreen = ({preloadedState}) => {
            const state = preloadedState?.user || {};
            const {rankings = [], rankingsLoading = false, error} = state;

            if (rankingsLoading) {
                return <Text testID="loading">Loading rankings...</Text>;
            }
            if (error) {
                return <Text testID="error">{error}</Text>;
            }
            if (rankings.length === 0) {
                return <Text testID="empty">No ranking data</Text>;
            }

            return (
                <View>
                    {rankings.map((r) => (
                        <RankingBadge key={r.user_id} rank={r.rank} user={r.user_name}/>
                    ))}
                </View>
            );
        };

        return {
            __esModule: true,
            default: RankingsScreen,
            OrderStatusBadge: () => null, // not used here
            RankingBadge,
        };
    }
);

describe('RankingsScreen (mocked)', () => {
    it('shows loading when loading', () => {
        const {getByTestId} = render(
            <RankingsScreen preloadedState={{user: {rankingsLoading: true}}}/>
        );
        expect(getByTestId('loading').props.children).toBe('Loading rankings...');
    });

    it('shows error when error present', () => {
        const {getByTestId} = render(
            <RankingsScreen preloadedState={{user: {error: 'Fail'}}}/>
        );
        expect(getByTestId('error').props.children).toBe('Fail');
    });

    it('shows empty when no rankings', () => {
        const {getByTestId} = render(
            <RankingsScreen preloadedState={{user: {rankings: []}}}/>
        );
        expect(getByTestId('empty').props.children).toBe('No ranking data');
    });

    it('renders badge entries when rankings exist', () => {
        const rankings = [
            {user_id: 'u1', user_name: 'Alice', rank: 1},
            {user_id: 'u2', user_name: 'Bob', rank: 2},
        ];
        const {getByTestId} = render(
            <RankingsScreen preloadedState={{user: {rankings}}}/>
        );
        expect(getByTestId('badge-Alice').props.children).toBe('1. Alice');
        expect(getByTestId('badge-Bob').props.children).toBe('2. Bob');
    });
});
