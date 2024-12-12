// store/userSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid'; // Generate unique IDs

// Define the initial state using TypeScript interfaces
interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}


interface UserState {
    password: string;
    phoneNumber: string;
    selectedCode: string;
    email: string;
    name_surname: string;
    passwordLogin: boolean; // New field
    verificationCode: string; // New field
    step: "send_code" | "verify_code" | "skip_verification";
    login_type: "email" | "phone_number";
    cart: CartItem[];
    addresses: Address[]; // Updated
    // currentAddress: Address | null;
    selectedAddressId: string | null; // ID of selected address

    loading: boolean;  // Keep loading and error states for later use
    error: string | null;
}

const initialState: UserState = {
    phoneNumber: '',
    password: '',
    selectedCode: '+90',
    email: '',
    name_surname: '',
    passwordLogin: false,
    verificationCode: '',
    step: 'send_code', // Default
    login_type: 'email', // Default
    cart: [],
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
};

// Define the address structure
interface Address {
    id: string; // Unique identifier, not the id in the data
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Synchronous actions
        setSelectedCode(state, action: PayloadAction<string>) {
            state.selectedCode = action.payload;
        },
        setPhoneNumber(state, action: PayloadAction<string>) {
            state.phoneNumber = action.payload.replace(/[^0-9]/g, '').slice(0, 15);
            if (!state.phoneNumber && !state.email) {
                state.password = ''; // Clear password when both are empty
            }
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
            if (!state.phoneNumber && !state.email) {
                state.password = ''; // Clear password when both are empty
            }
        },
        setName(state, action: PayloadAction<string>) {
            state.name_surname = action.payload;
        },
        setStep(state, action: PayloadAction<"send_code" | "verify_code" | "skip_verification">) {
            state.step = action.payload;
        },
        setLoginType(state, action: PayloadAction<"email" | "phone_number">) {
            state.login_type = action.payload;
        },
        setPasswordLogin(state, action: PayloadAction<boolean>) {
            state.passwordLogin = action.payload;
        },
        setVerificationCode(state, action: PayloadAction<string>) {
            state.verificationCode = action.payload;
        },

        setPassword(state, action: PayloadAction<string>) { // Keep, but be cautious
            state.password = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
        addToCart(state, action: PayloadAction<CartItem>) {
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        },
        clearCart(state) {
            state.cart = [];
        },
        // Add a new address
        addAddress(state, action: PayloadAction<Omit<Address, 'id'>>) {
            const newAddress: Address = {...action.payload, id: uuidv4()};
            state.addresses.push(newAddress);
            if (state.addresses.length === 1) {
                state.selectedAddressId = newAddress.id; // Default to first address
            }
        },

        // Remove an address by ID
        removeAddress(state, action: PayloadAction<string>) {
            state.addresses = state.addresses.filter(
                (address) => address.id !== action.payload
            );
            // Reset selectedAddressId if the current selected address is removed
            if (state.selectedAddressId === action.payload) {
                state.selectedAddressId = state.addresses[0]?.id || null;
            }
        },

        // Set a selected address by ID
        setSelectedAddress(state, action: PayloadAction<string>) {
            if (state.addresses.some((address) => address.id === action.payload)) {
                state.selectedAddressId = action.payload;
            }
        },

        logout(state) {
            state.phoneNumber = '';
            // ... reset other fields as needed
        },
    },
});


// Export actions for use in components
export const {
    setPhoneNumber,
    setSelectedCode,
    setEmail,
    setName,
    setPassword,
    setPasswordLogin,
    setVerificationCode,
    setStep,       // New
    setLoginType,  // New    // ... other actions
    setToken,
    addAddress,
    removeAddress,
    setSelectedAddress,
} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;

