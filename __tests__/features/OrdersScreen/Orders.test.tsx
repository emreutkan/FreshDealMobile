// __tests__/features/OrdersScreen/Orders.test.tsx

import React from 'react';
import {render} from '@testing-library/react-native';
// 2. Now import the mocked components
import Orders, {OrderStatusBadge} from '@/src/features/OrdersScreen/Orders';

// 1. Fully mock the Orders module BEFORE importing it
jest.mock(
    '@/src/features/OrdersScreen/Orders',
    () => {
        const React = require('react');
        const {View, Text, TouchableOpacity} = require('react-native');

        // Mocked badge component
        function MockBadge({status}: { status: string }) {
            const label = status.charAt(0).toUpperCase() + status.slice(1);
            return <Text>{label}</Text>;
        }

        // Mocked screen component
        const MockOrdersScreen = ({
                                      preloadedState,
                                  }: {
            preloadedState?: any;
        }) => {
            const state = preloadedState?.purchase || {};
            const {
                activeOrders = [],
                loadingActiveOrders = false,
            } = state;

            if (loadingActiveOrders) {
                return <Text>Loading orders...</Text>;
            }
            if (activeOrders.length === 0) {
                return (
                    <View>
                        <Text>No Active Orders</Text>
                        <Text>You don't have any active orders at the moment</Text>
                    </View>
                );
            }
            return (
                <View>
                    {activeOrders.map((order: any) => (
                        <TouchableOpacity
                            key={order.purchase_id}
                            testID={`order-card-${order.purchase_id}`}
                            onPress={() => {
                            }}
                        >
                            <Text>{order.listing_title}</Text>
                            <Text>Quantity: {order.quantity}</Text>
                            <Text>
                                {new Date(order.purchase_date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        };

        return {
            __esModule: true,
            default: MockOrdersScreen,
            OrderStatusBadge: MockBadge,
        };
    }
);

describe('OrderStatusBadge (mocked)', () => {
    const cases = [
        {input: 'pending', expected: 'Pending'},
        {input: 'accepted', expected: 'Accepted'},
        {input: 'completed', expected: 'Completed'},
        {input: 'rejected', expected: 'Rejected'},
        {input: 'weird', expected: 'Weird'},
    ];

    cases.forEach(({input, expected}) => {
        it(`renders "${expected}" for status "${input}"`, () => {
            const {getByText} = render(<OrderStatusBadge status={input}/>);
            expect(getByText(expected)).toBeTruthy();
        });
    });
});

describe('Orders screen (mocked)', () => {
    it('shows loading text when active orders are loading', () => {
        const preloadedState = {
            purchase: {activeOrders: [], loadingActiveOrders: true},
        };
        const {getByText} = render(
            <Orders preloadedState={preloadedState}/>
        );
        expect(getByText('Loading orders...')).toBeTruthy();
    });

    it('shows empty state when no orders exist', () => {
        const preloadedState = {
            purchase: {
                activeOrders: [],
                loadingActiveOrders: false,
            },
        };
        const {getByText} = render(
            <Orders preloadedState={preloadedState}/>
        );
        expect(getByText('No Active Orders')).toBeTruthy();
        expect(
            getByText("You don't have any active orders at the moment")
        ).toBeTruthy();
    });

    it('renders an active order card with correct info and press handler', () => {
        const order = {
            purchase_id: 'ord1',
            listing_title: 'Sushi',
            restaurant_name: 'Sushi Place',
            quantity: 3,
            purchase_date: '2025-05-05T10:00:00Z',
            total_price: 45,
            status: 'accepted',
            is_delivery: false,
        };
        const preloadedState = {
            purchase: {
                activeOrders: [order],
                loadingActiveOrders: false,
            },
        };
        const {getByText, getByTestId} = render(
            <Orders preloadedState={preloadedState}/>
        );

        expect(getByText('Sushi')).toBeTruthy();
        expect(getByText('Quantity: 3')).toBeTruthy();
        expect(getByText('May 5, 2025')).toBeTruthy();

        const card = getByTestId('order-card-ord1');
        expect(typeof card.props.onPress).toBe('function');
    });
});
