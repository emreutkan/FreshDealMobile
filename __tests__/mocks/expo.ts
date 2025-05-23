// TypeScript-specific mocks for Expo modules

export const Font = {
    loadAsync: jest.fn((fonts: Record<string, any>): Promise<void> => Promise.resolve()),
};

export const SplashScreen = {
    preventAutoHideAsync: jest.fn((): Promise<boolean> => Promise.resolve(true)),
    hideAsync: jest.fn((): Promise<boolean> => Promise.resolve(true)),
};

interface NotificationHandler {
    handleNotification: () => Promise<{
        shouldShowAlert: boolean;
        shouldPlaySound: boolean;
        shouldSetBadge: boolean;
    }>;
}

export const Notifications = {
    setNotificationHandler: jest.fn((handler: NotificationHandler): void => {
    }),
    addNotificationReceivedListener: jest.fn(() => ({remove: jest.fn()})),
    addNotificationResponseReceivedListener: jest.fn(() => ({remove: jest.fn()})),
    requestPermissionsAsync: jest.fn((): Promise<{ granted: boolean }> =>
        Promise.resolve({granted: true})),
    getExpoPushTokenAsync: jest.fn((): Promise<{ data: string }> =>
        Promise.resolve({data: 'ExponentPushToken[xxxxxxxxxxxx]'})),
};