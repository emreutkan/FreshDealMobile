import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';
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
        addAddress(state, action: PayloadAction<Omit<Address, 'id'>>) {
            const newAddress: Address = {...action.payload, id: uuidv4()};
            state.addresses.push(newAddress);
            if (state.addresses.length === 1) {
                state.selectedAddressId = newAddress.id;
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
                const index = state.addresses.findIndex((addr) => addr.id.startsWith('temp-'));
                if (index !== -1) {
                    state.addresses[index] = {...state.addresses[index], ...action.payload, id: action.payload.id};
                } else {
                    state.addresses.push(action.payload); // Fallback in case temp address is not found
                }
                state.loading = false;
            })
            .addCase(addAddressAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add address';
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.addresses = action.payload.user_address_list.map((address) => ({
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
                    doorNo: address.doorNo,
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
