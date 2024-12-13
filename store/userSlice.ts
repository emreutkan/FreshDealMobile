// store/userSlice.ts

import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import 'react-native-get-random-values'; // This package polyfills crypto.getRandomValues() for React Native.
// Polyfill crypto Before Importing uuid otherwise it will crash
import {v4 as uuidv4} from 'uuid';
import {RootState} from "@/store/store";
import {addAddressAPI, loginUserAPI, registerUserAPI} from "@/api/userAPI"; // Generate unique IDs
const id = uuidv4();
console.log(id);

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
    token: string | null;
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
    token: null,
};

// Define the address structure
export interface Address {
    id: string; // Unique identifier, not the id in the data
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
    doorNo: string,
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
    extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
        builder
            .addCase(addAddressAsync.fulfilled, (state, action) => {
                const index = state.addresses.findIndex(addr => addr.id.startsWith('temp-'));
                if (index !== -1) {
                    state.addresses[index] = action.payload; // Replace temp with actual address
                }
            })
        // .addCase(deleteAddressAsync.rejected, (state, action) => {
        //     // Rollback handling for delete failure, if needed
        //     console.error('Failed to delete address:', action.payload);
        // })
        // .addCase(editAddressAsync.rejected, (state, action) => {
        //     // Rollback handling for edit failure, if needed
        //     console.error('Failed to edit address:', action.payload);
        // });
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

// Thunks

export const addAddressAsync = createAsyncThunk<
    Address,                      // Return type
    Omit<Address, 'id'>,          // Payload type
    { rejectValue: string; state: RootState }
>(
    'user/addAddressAsync',
    async (address, {rejectWithValue, getState, dispatch}) => {
        // Generate a temporary ID
        const tempId = `temp-${Date.now()}`;
        const tempAddress = {...address, id: tempId};

        // Optimistically add the address
        dispatch(addAddress(tempAddress));

        try {
            const token = getState().user.token;
            if (!token) {
                throw new Error('Authentication token is missing.');
            }

            // Send API request
            const response = await addAddressAPI(address, token);
            return response as Address;
        } catch (error: any) {
            dispatch(removeAddress(tempId)); // Rollback if API fails
            const errorMessage = error.response?.data?.message || 'Failed to add address';
            return rejectWithValue(errorMessage);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (
        payload: {
            email?: string;
            phone_number?: string;
            password?: string;
            verification_code?: string;
            step?: "send_code" | "verify_code" | "skip_verification";
            login_type?: "email" | "phone_number";
            password_login?: boolean;
        },
        {rejectWithValue}
    ) => {
        console.log('loginUser thunk initiated with payload:', payload); // Log input payload
        try {
            const data = await loginUserAPI(payload);
            console.log('loginUserAPI response:', data); // Log successful response
            return data; // Return API response
        } catch (error: any) {
            console.error('loginUserAPI error:', error); // Log error details
            console.error('Error response data:', error.response?.data); // Log API error response if available
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (
        userData: {
            name_surname: string;
            email?: string;
            phone_number?: string;
            password: string;
        },
        {rejectWithValue}
    ) => {
        console.log('registerUser thunk initiated with payload:', userData);
        try {
            const data = await registerUserAPI(userData);
            console.log('registerUserAPI successful response:', data);
            return data;
        } catch (error: any) {
            console.error('registerUserAPI error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config,
            });
            return rejectWithValue(
                error.response?.data || 'Network Error or API failure'
            );
        }
    }
);