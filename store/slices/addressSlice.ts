// addressSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getUserData} from "@/store/thunks/userThunks";
import {addAddressAsync} from "@/store/thunks/addressThunks";

export interface Address {
    id: string;
    title: string;
    longitude: number;
    latitude: number;
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
    doorNo: string;
}

interface AddressState {
    addresses: Address[];
    selectedAddressId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AddressState = {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
};

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        addAddress(state, action: PayloadAction<Address>) { // Adjusted PayloadAction
            state.addresses.push(action.payload);
            if (state.addresses.length === 1) {
                state.selectedAddressId = action.payload.id;
            }
        },
        removeAddress(state, action: PayloadAction<string>) {
            state.addresses = state.addresses.filter((address) => address.id !== action.payload);
            if (state.selectedAddressId === action.payload) {
                state.selectedAddressId = state.addresses[0]?.id || null;
            }

        },
        setSelectedAddress(state, action: PayloadAction<string>) {
            if (state.addresses.some((address) => address.id === action.payload)) {
                state.selectedAddressId = action.payload;
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(addAddressAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddressAsync.fulfilled, (state, action) => {
                if (!action.payload || typeof action.payload.id !== 'string') {
                    console.error('Invalid payload received in addAddressAsync.fulfilled:', action.payload);
                    state.error = 'Failed to add address due to invalid data.';
                    state.loading = false;
                    return;
                }

                const index = state.addresses.findIndex((addr) => addr.id.startsWith('temp-'));
                if (index !== -1) {
                    // Replace the temporary address with the actual address from the backend
                    state.addresses[index] = {...state.addresses[index], ...action.payload, id: action.payload.id};
                } else {
                    // If temp address not found, add the new address
                    state.addresses.push(action.payload);
                }

                // Optionally, set the newly added address as selected
                state.selectedAddressId = action.payload.id;

                state.loading = false;
            })
            .addCase(addAddressAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add address';
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.addresses = action.payload.user_address_list.map((address: any) => ({
                    id: address.id.toString(),
                    title: address.title,
                    longitude: address.longitude,
                    latitude: address.latitude,
                    street: address.street,
                    neighborhood: address.neighborhood,
                    district: address.district,
                    province: address.province,
                    country: address.country,
                    postalCode: address.postalCode.toString(),
                    apartmentNo: address.apartmentNo.toString(),
                    doorNo: address.doorNo.toString(),
                }));
                // Set the first address as selected if none is selected
                if (state.addresses.length > 0 && !state.selectedAddressId) {
                    state.selectedAddressId = state.addresses[0].id;
                }
            });
    },
});


export const {addAddress, removeAddress, setSelectedAddress} = addressSlice.actions;

export default addressSlice.reducer;
