import { validateToken } from '@/src/services/tokenService';

describe('validateToken', () => {
  test('returns token when provided', () => {
    expect(validateToken('abc')).toBe('abc');
  });

  test('throws error for missing token', () => {
    // @ts-expect-error testing null input
    expect(() => validateToken(null)).toThrow('Authentication token is missing.');
  });
});
