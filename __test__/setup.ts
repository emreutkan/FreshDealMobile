// Jest setup can be extended here if needed
// Silence native animated warning and mock native driver
jest.mock('react-native/src/private/animated/NativeAnimatedHelper');
// polyfill setImmediate used by Animated
global.setImmediate = global.setImmediate || ((fn: any, ...args: any[]) => global.setTimeout(fn, 0, ...args));
