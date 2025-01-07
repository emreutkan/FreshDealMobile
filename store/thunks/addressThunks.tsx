import {createAsyncThunk} from '@reduxjs/toolkit';
import {addAddressAPI, updateAddressAPI} from "@/api/userAPI";
import {RootState} from "@/store/store";
import {addAddress, Address, removeAddress} from "@/store/slices/addressSlice";

// Add address
export const addAddressAsync = createAsyncThunk<
    Address,
    Omit<Address, 'id'>,
    { rejectValue: string; state: RootState }
>(
    'address/addAddressAsync',
    async (address, {rejectWithValue, getState, dispatch}) => {
        const tempId = `temp-${Date.now()}`;
        const tempAddress = {...address, id: tempId};
        dispatch(addAddress(tempAddress));

        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            const response = await addAddressAPI(address, token);
            return response as Address;
        } catch (error: any) {
            dispatch(removeAddress(tempId));
            return rejectWithValue(error.response?.data || 'Failed to add address');
        }
    }
);


export const updateAddress = createAsyncThunk<
    Address, // Return type
    { id: string; updates: Partial<Address> }, // Payload type
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

            // Call the API to update the address
            // Return the updated address object
            return await updateAddressAPI(id, updates, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);