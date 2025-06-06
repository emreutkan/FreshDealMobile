// Jest setup can be extended here if needed
// Silence native animated warning and mock native driver
jest.mock('react-native/src/private/animated/NativeAnimatedHelper');
// Mock SecureStore for tests to avoid native module errors
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn()
}));
// polyfill setImmediate used by Animated
global.setImmediate = global.setImmediate || ((fn: any, ...args: any[]) => global.setTimeout(fn, 0, ...args));