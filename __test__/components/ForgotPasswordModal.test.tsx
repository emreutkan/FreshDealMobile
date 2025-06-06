import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ForgotPasswordModal } from '../../src/features/LoginRegister/components/ForgotPasswordModalContent';
// Mock vector icons used in the modal
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { MaterialIcons: (props: any) => <icon {...props} /> };
});

describe('ForgotPasswordModal', () => {
  it('triggers onClose when cancel pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ForgotPasswordModal isVisible onClose={onClose} onSubmit={jest.fn()} />
    );
    fireEvent.press(getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('submits email when send pressed', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByText, getByDisplayValue } = render(
      <ForgotPasswordModal isVisible onClose={() => {}} onSubmit={onSubmit} />
    );
    fireEvent.changeText(getByDisplayValue(''), 'a@b.com');
    await fireEvent.press(getByText('Send'));
    expect(onSubmit).toHaveBeenCalledWith('a@b.com');
  });
});
