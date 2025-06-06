import React from 'react';
import { render } from '@testing-library/react-native';
import Landing from '../../src/features/LoginRegister/screens/Landing';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { LinearGradient: ({ children }: any) => <View>{children}</View> };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (p: any) => <icon {...p} />, MaterialIcons: (p: any) => <icon {...p} /> };
});

const reset = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ reset });

describe('Landing screen', () => {
  it('navigates to home when token exists', () => {
    (useSelector as jest.Mock).mockReturnValue({ token: 'abc' });
    render(<Landing />);
    expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'HomeScreen' }] });
  });
});
