import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {addItemToCart, fetchCart} from '../../../src/redux/thunks/cartThunks';
import * as cartApi from '../../../src/services/cartService';

jest.mock('../../../src/services/cartService');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Cart Thunks', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: {
                token: 'test-token'
            },
            cart: {
                cartItems: []
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches cart items successfully', async () => {
        const mockCartItems = [
            {
                id: '1',
                listing_id: 123,
                quantity: 2,
                price: 10.99,
                title: 'Test Item',
                restaurant_id: 5,
                restaurant_name: 'Test Restaurant'
            }
        ];

        (cartApi.getCart as jest.Mock).mockResolvedValue({items: mockCartItems});

        await store.dispatch(fetchCart());

        const actions = store.getActions();
        expect(actions[0].type).toBe(fetchCart.pending.type);
        expect(actions[1].type).toBe(fetchCart.fulfilled.type);
        expect(actions[1].payload).toEqual(mockCartItems);
    });

    it('handles fetch cart failure', async () => {
        const errorMessage = 'Failed to fetch cart';
        (cartApi.getCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await store.dispatch(fetchCart());

        const actions = store.getActions();
        expect(actions[0].type).toBe(fetchCart.pending.type);
        expect(actions[1].type).toBe(fetchCart.rejected.type);
        expect(actions[1].error.message).toContain(errorMessage);
    });

    it('adds item to cart successfully', async () => {
        const mockCartItem = {
            listing_id: 123,
            quantity: 2,
            is_pickup: true
        };

        (cartApi.addToCart as jest.Mock).mockResolvedValue({success: true});

        await store.dispatch(addItemToCart(mockCartItem));

        const actions = store.getActions();
        expect(actions[0].type).toBe(addItemToCart.pending.type);
        expect(actions[1].type).toBe(addItemToCart.fulfilled.type);
        expect(cartApi.addToCart).toHaveBeenCalledWith(mockCartItem, 'test-token');
    });
});