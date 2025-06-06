import restaurantReducer, { setSelectedRestaurant, setRadius } from '../../src/redux/slices/restaurantSlice';

const initialState = {
  restaurantsProximity: [],
  restaurantsProximityStatus: 'idle',
  restaurantsProximityLoading: false,
  favoriteRestaurantsIDs: [],
  favoritesStatus: 'idle',
  favoritesLoading: false,
  radius: 50,
  error: null,
  selectedRestaurant: { pickup: false, delivery: false },
  selectedRestaurantListings: [],
  selectedRestaurantListing: {},
  listingsLoading: false,
  listingsError: null,
  isPickup: true,
  pagination: null,
  commentAnalysis: null,
  commentAnalysisLoading: false,
  commentAnalysisError: null,
  recentRestaurantIDs: [],
  recentRestaurantsLoading: false,
  recentRestaurantsError: null,
  comments: [],
  commentsLoading: false,
  commentsError: null,
  flashDealsRestaurants: [],
  flashDealsLoading: false,
  flashDealsError: null,
};

describe('restaurantSlice reducers', () => {
  it('sets radius', () => {
    const state = restaurantReducer(initialState, setRadius(10));
    expect(state.radius).toBe(10);
  });

  it('toggles pickup based on selected restaurant', () => {
    const restaurant = { pickup: false, delivery: true } as any;
    let state = restaurantReducer(initialState, setSelectedRestaurant(restaurant));
    expect(state.isPickup).toBe(false);

    const restaurant2 = { pickup: true, delivery: false } as any;
    state = restaurantReducer({ ...state, isPickup: false }, setSelectedRestaurant(restaurant2));
    expect(state.isPickup).toBe(true);
  });
});
