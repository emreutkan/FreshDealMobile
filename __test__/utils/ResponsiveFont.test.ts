import { jest } from '@jest/globals';

const widthRef = { value: 375 };
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: widthRef.value }))
  }
}));

const modulePath = '../../src/utils/ResponsiveFont';
// import after mocking
const { scaleFont } = require(modulePath);

describe('scaleFont', () => {
  it('returns original size when width equals guideline', () => {
    expect(scaleFont(10)).toBeCloseTo(10);
  });

  it('scales proportionally with different width', () => {
    widthRef.value = 750;
    jest.isolateModules(() => {
      const { scaleFont: scaleFont2 } = require(modulePath);
      expect(scaleFont2(10)).toBeCloseTo(20);
    });
  });
});
