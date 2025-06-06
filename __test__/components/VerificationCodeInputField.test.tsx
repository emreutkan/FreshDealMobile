import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import VerificationCodeInputField from '../../src/features/LoginRegister/components/VerificationCodeInputField';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { MaterialIcons: (props: any) => <icon {...props} /> };
});

describe('VerificationCodeInputField', () => {
  it('updates code on input change', () => {
    const onChange = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <VerificationCodeInputField value="" onChangeText={onChange} />
    );
    const inputs = UNSAFE_getAllByType('TextInput');
    fireEvent.changeText(inputs[0], '1');
    expect(onChange).toHaveBeenCalledWith('1');
  });
});
