import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BaseInput from '../../src/features/LoginRegister/components/BaseInput';

describe('BaseInput', () => {
  it('calls onChangeText when typing', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <BaseInput value="" onChangeText={onChangeText} placeholder="Email" />
    );
    const input = getByDisplayValue('');
    fireEvent.changeText(input, 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('clears text when clear button pressed', () => {
    const onChangeText = jest.fn();
    const { getByText } = render(
      <BaseInput value="abc" onChangeText={onChangeText} placeholder="Email" />
    );
    fireEvent.press(getByText('×'));
    expect(onChangeText).toHaveBeenCalledWith('');
  });
});
