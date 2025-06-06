import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { CustomButton } from '../../src/features/LoginRegister/components/CustomButton';

describe('CustomButton', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CustomButton title="Press" onPress={onPress} />
    );
    fireEvent.press(getByText('Press'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows loader when loading', () => {
    const { queryByText, UNSAFE_getAllByType } = render(
      <CustomButton title="Load" loading onPress={() => {}} />
    );
    expect(queryByText('Load')).toBeNull();
    expect(UNSAFE_getAllByType(ActivityIndicator).length).toBe(1);
  });
});
