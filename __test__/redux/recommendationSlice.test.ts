import recommendationReducer, { getRecommendationsStart, getRecommendationsSuccess, getRecommendationsFailed } from '../../src/redux/slices/recommendationSlice';

describe('recommendationSlice reducers', () => {
  const initialState = { recommendationIds: [], loading: false, error: null, status: 'idle' };

  it('sets loading on start', () => {
    const state = recommendationReducer(initialState, getRecommendationsStart());
    expect(state.loading).toBe(true);
    expect(state.status).toBe('loading');
  });

  it('stores ids on success', () => {
    const state = recommendationReducer(initialState, getRecommendationsSuccess([1,2]));
    expect(state.recommendationIds).toEqual([1,2]);
    expect(state.loading).toBe(false);
    expect(state.status).toBe('succeeded');
  });

  it('stores error on failure', () => {
    const state = recommendationReducer(initialState, getRecommendationsFailed('err'));
    expect(state.error).toBe('err');
    expect(state.status).toBe('failed');
  });
});
