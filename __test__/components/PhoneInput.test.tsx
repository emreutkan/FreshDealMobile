import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PhoneInput from '../../src/features/LoginRegister/components/PhoneInput';
import { useDispatch, useSelector } from 'react-redux';
import { setPhoneNumber, setSelectedCode } from '../../src/redux/slices/userSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Picker = ({ children }: any) => <View>{children}</View>;
  Picker.Item = ({ label }: any) => <Text>{label}</Text>;
  return { Picker };
});

const mockState = { user: { phoneNumber: '', selectedCode: '+1' } };
(useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));
const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);

describe('PhoneInput', () => {
  beforeEach(() => {
    dispatch.mockClear();
  });

  it('sanitizes input and dispatches phone number', () => {
    const { getByDisplayValue } = render(<PhoneInput />);
    const input = getByDisplayValue('');
    fireEvent.changeText(input, '123abc');
    expect(dispatch).toHaveBeenCalledWith(setPhoneNumber('123'));
  });

  it('dispatches selected code on confirm', () => {
    const { getByText } = render(<PhoneInput />);
    fireEvent.press(getByText('+1'));
    fireEvent.press(getByText('Confirm'));
    expect(dispatch).toHaveBeenCalledWith(setSelectedCode('+1'));
  });
});
