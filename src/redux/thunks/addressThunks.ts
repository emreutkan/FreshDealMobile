import {createAsyncThunk} from '@reduxjs/toolkit';

import {RootState} from "@/src/redux/store"; // Updated import
import {getUserDataThunk} from "@/src/redux/thunks/userThunks";
import {addAddressAPI, deleteAddressAPI, updateAddressAPI} from "@/src/redux/api/addressAPI";
import {Address} from "@/src/types/api/address/model";
import {tokenService} from "@/src/services/tokenService";

export const setPrimaryAddress = createAsyncThunk<
    Address,
    string,
    { state: RootState; rejectValue: string }
>(
    'address/setPrimaryAddress',
    async (addressId, {getState, dispatch, rejectWithValue}) => {
        try {
            const state = getState();
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            const addressToUpdate = state.address.addresses.find(
                (addr) => addr.id === addressId
            );
            if (!addressToUpdate) {
                console.log('Address not found');
            }

            const updatedAddress = await updateAddressAPI(addressId, {is_primary: true}, token);

            await dispatch(getUserDataThunk({token}));

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

export const addAddressAsync = createAsyncThunk<
    Address,
    Omit<Address, 'id'>,
    { rejectValue: string; state: RootState }
>(
    'address/addAddressAsync',
    async (address, {rejectWithValue, dispatch}) => {
        console.log('Address payload in thunk:', address);

        const token = await tokenService.getToken();

        try {
            const addressPayload = {
                ...address,
                is_primary: true
            };

            console.log('Sending to API:', addressPayload);

            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            const response = await addAddressAPI(addressPayload, token);

            console.log('API Response:', response);

            // Update user data to get the latest address list
            await dispatch(getUserDataThunk({token}));

            // Check the nested address object's is_primary property
            if (response?.address && !response.address.is_primary) {
                // Make an API call to set this address as primary
                await dispatch(setPrimaryAddress(response.address.id));
            }

            // Return the address object from the response
            return response.address as Address;
        } catch (error: any) {
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            await dispatch(getUserDataThunk({token}));

            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data ||
                'Failed to add address'
            );
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
    async ({id, updates}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            updates.is_primary = true; // temporary solution updated address
            const response = await updateAddressAPI(id, updates, token);
            await dispatch(getUserDataThunk({token}));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);

export const deleteAddressAsync = createAsyncThunk<
    void,
    string,
    { rejectValue: string; state: RootState }
>(
    'address/deleteAddressAsync',
    async (addressId, {rejectWithValue, dispatch}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            await deleteAddressAPI(addressId, token);

            await dispatch(getUserDataThunk({token}));

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data ||
                'Failed to delete address'
            );
        }
    }
);
