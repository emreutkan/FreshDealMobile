import { pushNotificationsApi } from '@/src/redux/api/pushNotifications';
import { apiClient } from '@/src/services/apiClient';
import { tokenService } from '@/src/services/tokenService';

jest.mock('@/src/services/apiClient', () => ({
  apiClient: { request: jest.fn() }
}));
jest.mock('@/src/services/tokenService', () => ({
  tokenService: { getToken: jest.fn() }
}));
jest.mock('expo-device', () => ({ osVersion: '1.0' }));
jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

describe('pushNotificationsApi', () => {
  test('updatePushToken cleans token and posts to API', async () => {
    (tokenService.getToken as jest.Mock).mockResolvedValue('jwt');
    (apiClient.request as jest.Mock).mockResolvedValue({ success: true, message: 'ok' });

    await pushNotificationsApi.updatePushToken('ExponentPushToken[abc]');

    expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      data: expect.objectContaining({ push_token: 'abc' })
    }));
  });
});
