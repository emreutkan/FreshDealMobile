import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GoBack } from '../../src/features/homeScreen/components/goBack';
import { useNavigation } from '@react-navigation/native';
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Feather: (props: any) => <icon {...props} /> };
});

const goBackMock = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ goBack: goBackMock } as any);

describe('GoBack', () => {
  it('navigates back on press', () => {
    const { getByTestId } = render(<GoBack />);
    const button = getByTestId('go-back-button');
    fireEvent.press(button);
    expect(goBackMock).toHaveBeenCalled();
  });
});
