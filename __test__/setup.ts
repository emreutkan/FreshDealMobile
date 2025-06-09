// Jest setup can be extended here if needed
// Silence native animated warning and mock native driver
jest.mock('react-native/src/private/animated/NativeAnimatedHelper');

// Mock SecureStore for tests to avoid native module errors
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn()
}));

// Mock expo-haptics to prevent NativeModule errors
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// polyfill timers used by React Native
global.setImmediate = global.setImmediate || ((fn: any, ...args: any[]) => global.setTimeout(fn, 0, ...args));
// some components rely on clearImmediate
global.clearImmediate = global.clearImmediate || ((id: any) => global.clearTimeout(id));
