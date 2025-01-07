import {createAsyncThunk} from '@reduxjs/toolkit';
import {addAddressAPI, updateAddressAPI} from "@/api/userAPI";
import {RootState} from "@/store/store";
import {addAddress, Address, removeAddress} from "@/store/slices/addressSlice";
import {getUserData} from "@/store/thunks/userThunks";

// Add address - Updated to handle primary address logic
export const addAddressAsync = createAsyncThunk<
    Address,
    Omit<Address, 'id'>,
    { rejectValue: string; state: RootState }
>(
    'address/addAddressAsync',
    async (address, {rejectWithValue, getState, dispatch}) => {
        const tempId = `temp-${Date.now()}`;
        // If this is the first address, set it as primary
        const currentAddresses = getState().address.addresses;
        const shouldBePrimary = currentAddresses.length === 0;
        const tempAddress = {...address, id: tempId, is_primary: shouldBePrimary};

        dispatch(addAddress(tempAddress));

        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            const response = await addAddressAPI({...address, is_primary: shouldBePrimary}, token);
            return response as Address;
        } catch (error: any) {
            dispatch(removeAddress(tempId));
            return rejectWithValue(error.response?.data || 'Failed to add address');
        }
    }
);

// Update address - No changes needed
export const updateAddress = createAsyncThunk<
    Address,
    { id: string; updates: Partial<Address> },
    { state: RootState; rejectValue: string }
>(
    'address/updateAddress',
    async ({id, updates}, {getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            return await updateAddressAPI(id, updates, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);
export const setPrimaryAddress = createAsyncThunk<
    Address,
    string,
    { state: RootState; rejectValue: string }
>(
    'address/setPrimaryAddress',
    async (addressId, {getState, dispatch, rejectWithValue}) => {
        try {
            const state = getState();
            const token = state.user.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            // Get the address from the current Redux store
            const addressToUpdate = state.address.addresses.find(
                (addr) => addr.id === addressId
            );
            if (!addressToUpdate) {
                throw new Error('Address not found');
            }

            // Call your API to set this address as primary
            const updatedAddress = await updateAddressAPI(addressId, {is_primary: true}, token);

            // Now re-fetch the latest user data (or addresses) so the Redux store is in sync
            await dispatch(getUserData({token}));

            console.log('Successfully updated primary address:', updatedAddress);
            return updatedAddress;
        } catch (error: any) {
            console.error('Error setting primary address:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to set primary address'
            );
        }
    }
);