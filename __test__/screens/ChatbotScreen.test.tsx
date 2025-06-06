import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatbotScreen from '../../src/features/Chatbot/ChatbotScreen';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { apiClient } from '../../src/services/apiClient';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('../../src/services/apiClient', () => ({
  apiClient: { request: jest.fn() }
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon {...props} /> };
});

const goBack = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ goBack });
(useSelector as jest.Mock).mockReturnValue({ user: { token: 'abc' } });

(apiClient.request as jest.Mock).mockResolvedValue({ success: true, message: 'Hello from bot' });

describe('ChatbotScreen', () => {
  it('shows initial bot message', async () => {
    const { findByText } = render(<ChatbotScreen />);
    expect(await findByText('Hello from bot')).toBeTruthy();
  });

  it('sends user message and displays response', async () => {
    (apiClient.request as jest.Mock).mockResolvedValueOnce({ success: true, message: 'Hello from bot' });
    (apiClient.request as jest.Mock).mockResolvedValueOnce({ message: 'Echo' });
    const { getByPlaceholderText, getByRole, findByText } = render(<ChatbotScreen />);
    const input = getByPlaceholderText('Type your message...');
    fireEvent.changeText(input, 'Hi');
    const button = getByRole('button');
    fireEvent.press(button);
    await findByText('Hi');
    expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({ method: 'POST' }));
    expect(await findByText('Echo')).toBeTruthy();
  });
});
