import {createAsyncThunk} from '@reduxjs/toolkit';

import {RootState} from "@/src/redux/store";
import {addAddress, removeAddress} from "@/src/redux/slices/addressSlice";
import {getUserDataThunk} from "@/src/redux/thunks/userThunks";
import {addAddressAPI, updateAddressAPI} from "@/src/redux/api/addressAPI";
import {Address} from "@/src/types/api/address/model";
import {tokenService} from "@/src/services/tokenService";

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
        const token = await tokenService.getToken();
        if (!token) {
            console.error('Authentication token is missing.');
            return rejectWithValue('Authentication token is missing.');
        }

        try {

            const response = await addAddressAPI({...address, is_primary: shouldBePrimary}, token);
            await dispatch(getUserDataThunk({token}));

            return response as Address;
        } catch (error: any) {
            dispatch(removeAddress(tempId));
            await dispatch(getUserDataThunk({token}));

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
            const token = await tokenService.getToken();
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
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            const addressToUpdate = state.address.addresses.find(
                (addr) => addr.id === addressId
            );
            if (!addressToUpdate) {
                throw new Error('Address not found');
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