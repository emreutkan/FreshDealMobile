import searchReducer from '../../src/redux/slices/searchSlice';
import {SearchforRestaurantsThunk} from '@/src/redux/thunks/searchThunks';

describe('Search Slice', () => {
    const initialState = {
        searchResults: {
            results: [],
        },
        loading: false,
        error: null,
    };

    it('should handle initial state', () => {
        expect(searchReducer(undefined, {type: 'unknown'})).toEqual(initialState);
    });

    it('should handle pending state', () => {
        const action = {type: SearchforRestaurantsThunk.pending.type};
        const state = searchReducer(initialState, action);

        expect(state).toEqual({
            searchResults: {
                results: [],
            },
            loading: true,
            error: null,
        });
    });

    it('should handle fulfilled state', () => {
        const mockSearchResults = {
            results: [
                {id: '1', name: 'Restaurant 1'},
                {id: '2', name: 'Restaurant 2'},
            ],
        };

        const action = {
            type: SearchforRestaurantsThunk.fulfilled.type,
            payload: mockSearchResults
        };

        const state = searchReducer(initialState, action);

        expect(state).toEqual({
            searchResults: {
                results: mockSearchResults.results,
            },
            loading: false,
            error: null,
        });
    });

    it('should handle rejected state', () => {
        const error = 'Search failed';
        const action = {
            type: SearchforRestaurantsThunk.rejected.type,
            error: {message: error}
        };

        const state = searchReducer(initialState, action);

        expect(state).toEqual({
            searchResults: {
                results: [],
            },
            loading: true,
            error: error,
        });
    });

    it('should handle logout action', () => {
        const mockState = {
            searchResults: {
                results: [{id: '1', name: 'Restaurant 1'}],
            },
            loading: false,
            error: null,
        };

        const action = {type: 'user/logout'};
        const state = searchReducer(mockState, action);

        expect(state).toEqual(initialState);
    });
});