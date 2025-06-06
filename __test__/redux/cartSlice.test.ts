import cartReducer from '../../src/redux/slices/cartSlice';
import { fetchCart, resetCart } from '../../src/redux/thunks/cartThunks';

describe('cartSlice extra reducers', () => {
  const initialState = { cartItems: [], isPickup: true, cartTotal: 0, count: 0, loading: false, error: null };

  it('resets on user logout', () => {
    const state = cartReducer({ ...initialState, cartItems: [{ id: 1 }] }, { type: 'user/logout' });
    expect(state).toEqual(initialState);
  });

  it('handles fetchCart pending and fulfilled', () => {
    let state = cartReducer(initialState, { type: fetchCart.pending.type });
    expect(state.loading).toBe(true);
    state = cartReducer(state, { type: fetchCart.fulfilled.type, payload: [{ id: 1 }] });
    expect(state.loading).toBe(false);
    expect(state.cartItems).toEqual([{ id: 1 }]);
  });

  it('sets error on fetchCart rejected', () => {
    const state = cartReducer(initialState, { type: fetchCart.rejected.type, payload: 'err' });
    expect(state.error).toBe('err');
  });

  it('clears items on resetCart.fulfilled', () => {
    const pre = { ...initialState, cartItems: [{ id: 1 }] };
    const state = cartReducer(pre, { type: resetCart.fulfilled.type });
    expect(state.cartItems).toHaveLength(0);
  });
});
