import { calculateDistanceToRestaurant, isRestaurantOpen } from '../../src/utils/RestaurantFilters';

describe('calculateDistanceToRestaurant', () => {
  it('calculates distance in kilometers', () => {
    const distance = calculateDistanceToRestaurant(0, 0, 1, 0);
    expect(distance).toBeCloseTo(111.19, 2);
  });
});

describe('isRestaurantOpen', () => {
  const monday = new Date('2024-05-20T10:00:00Z'); // Monday

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(monday);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns true when current time within working hours', () => {
    const result = isRestaurantOpen(['Monday'], '09:00', '18:00');
    expect(result).toBe(true);
  });

  it('returns false when outside working hours', () => {
    const result = isRestaurantOpen(['Monday'], '11:00', '18:00');
    expect(result).toBe(false);
  });
});
