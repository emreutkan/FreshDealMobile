import addressReducer, { addAddress, removeAddress } from '../../src/redux/slices/addressSlice';

const initialState = {
  addresses: [] as any[],
  selectedAddressId: null as string | null,
  loading: false,
  error: null as string | null,
};

describe('addressSlice reducers', () => {
  it('adds address and sets selected when primary', () => {
    const addr = { id: '1', is_primary: true } as any;
    const state = addressReducer(initialState, addAddress(addr));
    expect(state.addresses).toHaveLength(1);
    expect(state.selectedAddressId).toBe('1');
  });

  it('removes address and clears selection', () => {
    const stateWith = { ...initialState, addresses: [{ id: '1', is_primary: true }], selectedAddressId: '1' };
    const state = addressReducer(stateWith, removeAddress('1'));
    expect(state.addresses).toHaveLength(0);
    expect(state.selectedAddressId).toBeNull();
  });
});
