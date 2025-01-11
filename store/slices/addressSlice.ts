// addressSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getUserData} from "@/store/thunks/userThunks";
import {addAddressAsync, setPrimaryAddress} from "@/store/thunks/addressThunks";
import {logout} from "@/store/slices/userSlice";

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
    is_primary: boolean;
}

interface AddAddressResponse {
    address: {
        apartmentNo: number;
        country: string;
        district: string;
        doorNo: string;
        id: string;
        is_primary: boolean;
        latitude: number;
        longitude: number;
        neighborhood: string;
        postalCode: number;
        province: string;
        street: string;
        title: string;
        user_id: number;
    };
    message: string;
    success: boolean;
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
        addAddress(state, action: PayloadAction<Address>) {
            state.addresses.push(action.payload);
            if (action.payload.is_primary) {
                state.selectedAddressId = action.payload.id;
            }
        },
        removeAddress(state, action: PayloadAction<string>) {
            state.addresses = state.addresses.filter((address) => address.id !== action.payload);
            if (state.selectedAddressId === action.payload) {
                // Find a primary address to select instead
                const primaryAddress = state.addresses.find(addr => addr.is_primary);
                state.selectedAddressId = primaryAddress?.id || null;
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
            .addCase(logout, () => initialState) // Reset state on global action

            .addCase(addAddressAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddressAsync.fulfilled, (state, action) => {
                // if (!action.payload) {
                //     console.error('Invalid payload received in addAddressAsync.fulfilled:', action.payload);
                //     state.error = 'Failed to add address due to invalid data.';
                //     state.loading = false;
                //     return;
                // }
                //
                // const index = state.addresses.findIndex((addr) => addr.id.startsWith('temp-'));
                // if (index !== -1) {
                //     state.addresses[index] = {...state.addresses[index], ...action.payload, id: action.payload.id};
                // } else {
                //     state.addresses.push(action.payload);
                // }
                // state.error = null;
                state.loading = false;
            })
            .addCase(addAddressAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add address';
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                console.error("state addresses before" + state.addresses);
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
                    apartmentNo: address.apartmentNo ? address.apartmentNo.toString() : null,
                    doorNo: address.doorNo ? address.doorNo.toString() : null,
                    is_primary: Boolean(address.is_primary),
                }));
                console.log("state addresses after" + state.addresses);


                console.error('Selected address ID before:', state.selectedAddressId);

                const primaryAddress = state.addresses.find(addr => addr.is_primary);
                if (primaryAddress) {
                    state.selectedAddressId = primaryAddress.id;
                    console.log('Selected address ID after:', state.selectedAddressId);

                }

            })
            .addCase(setPrimaryAddress.pending, (state) => {
                console.log('Redux State - primary address pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(setPrimaryAddress.fulfilled, (state, action: PayloadAction<Address>) => {
                console.log('Redux State - Updated Primary Address:', action.payload);
                state.loading = false;
                state.error = null;

            })
            .addCase(setPrimaryAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to set primary address';
            });

    },

});


export const {addAddress, removeAddress, setSelectedAddress} = addressSlice.actions;

export default addressSlice.reducer;
