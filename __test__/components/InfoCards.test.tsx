import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InfoCards from '../../src/features/accountScreen/components/InfoCards';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon {...props} /> };
});

describe('InfoCards', () => {
  const baseProps = {
    email: 'user@example.com',
    phoneNumber: '555',
    editedValues: { name_surname: '', email: 'user@example.com', phoneNumber: '' },
    setEditedValues: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows email text when not editing', () => {
    const { getByText, queryByPlaceholderText } = render(
      <InfoCards {...baseProps} isEditing={false} />
    );
    expect(getByText('user@example.com')).toBeTruthy();
    expect(queryByPlaceholderText('Enter your email')).toBeNull();
  });

  it('shows input and updates values when editing', () => {
    const setEditedValues = jest.fn();
    const { getByPlaceholderText } = render(
      <InfoCards {...baseProps} isEditing={true} setEditedValues={setEditedValues} />
    );
    const input = getByPlaceholderText('Enter your email');
    fireEvent.changeText(input, 'new@example.com');
    expect(setEditedValues).toHaveBeenCalledWith({
      ...baseProps.editedValues,
      email: 'new@example.com'
    });
  });
});
