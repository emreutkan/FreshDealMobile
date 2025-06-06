import React from 'react';
import { render } from '@testing-library/react-native';
import FlashDealsBottomSheet from '../../src/features/FlashDeals/FlashDealsBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { getFlashDealsThunk } from '../../src/redux/thunks/restaurantThunks';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../src/redux/thunks/restaurantThunks', () => ({
  getFlashDealsThunk: () => ({ type: 'FLASH' })
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.PanResponder = { create: () => ({ panHandlers: {} }) } as any;
  RN.Animated.timing = () => ({ start: jest.fn() });
  return RN;
});

jest.mock('@expo/vector-icons', () => { const React = require('react'); return { Feather: (p:any)=><icon {...p}/>, MaterialCommunityIcons:(p:any)=><icon {...p}/> }; });

jest.mock('expo-linear-gradient', () => { const React=require('react'); const {View}=require('react-native'); return { LinearGradient: ({children}:any)=> <View>{children}</View> }; });

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);
(useSelector as jest.Mock).mockReturnValue({ restaurant: { flashDealsRestaurants: [], flashDealsLoading: false } });

const noop = () => {};

describe('FlashDealsBottomSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches fetch when becoming visible', () => {
    const { rerender } = render(
      <FlashDealsBottomSheet isVisible={false} onClose={noop} onFloatingBadgePress={noop} />
    );
    expect(dispatch).not.toHaveBeenCalled();

    rerender(
      <FlashDealsBottomSheet isVisible={true} onClose={noop} onFloatingBadgePress={noop} />
    );
    expect(dispatch).toHaveBeenCalledWith(getFlashDealsThunk());
  });
});
