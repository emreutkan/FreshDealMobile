// store/userSlice.ts

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ApiResponse, login as loginService, UserData} from '../services/authService';

// Define the initial state using TypeScript interfaces
interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface RegisterData {
    name: string;
    surname: string;
    phoneNumber: string;
    selectedCode: string;
    email: string;
    password: string;
}

interface UserState {
    password: string;
    phoneNumber: string;
    selectedCode: string;
    email: string;
    name: string;
    surname: string;
    cart: CartItem[];
    addresses: string[];
    currentAddress: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    phoneNumber: '',
    selectedCode: '+90',
    email: '',
    name: '',
    surname: '',
    cart: [],
    addresses: [],
    currentAddress: null,
    loading: false,
    error: null,
};

// Async thunk for handling user login
export const loginUser = createAsyncThunk<
    UserData, // Return type of the payload creator
    { phoneNumber: string; selectedCode: string; password: string }, // First argument to the payload creator
    { rejectValue: string } // Type of the reject value
>(
    'user/login',
    async (loginData: { phoneNumber: string; selectedCode: string; password: string }, {rejectWithValue}) => {
        const response: ApiResponse = await loginService(loginData);
        if (response.success && response.userData) {
            return response.userData;
        } else {
            return rejectWithValue(response.message || 'Login failed');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Synchronous actions
        setPhoneNumber(state, action: PayloadAction<string>) {
            state.phoneNumber = action.payload.replace(/[^0-9]/g, '').slice(0, 15);
        },
        setSelectedCode(state, action: PayloadAction<string>) {
            state.selectedCode = action.payload;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setName(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        setSurname(state, action: PayloadAction<string>) {
            state.surname = action.payload;
        },
        // Note: It's generally not recommended to store passwords in Redux
        setPassword(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        getPassword(state) {
            return state.password;
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
        addAddress(state, action: PayloadAction<string>) {
            if (!state.addresses.includes(action.payload)) {
                state.addresses.push(action.payload);
            }
        },
        removeAddress(state, action: PayloadAction<string>) {
            state.addresses = state.addresses.filter(address => address !== action.payload);
            if (state.currentAddress === action.payload) {
                state.currentAddress = null;
            }
        },
        setCurrentAddress(state, action: PayloadAction<string>) {
            if (state.addresses.includes(action.payload)) {
                state.currentAddress = action.payload;
            }
        },
        // Optionally, you can add a logout action
        logout(state) {
            state.phoneNumber = '';
            state.selectedCode = '+90';
            state.email = '';
            state.name = '';
            state.surname = '';
            state.cart = [];
            state.addresses = [];
            state.currentAddress = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserData>) => {
                state.loading = false;
                state.name = action.payload.name;
                state.surname = action.payload.surname;
                state.email = action.payload.email;
                state.phoneNumber = action.payload.phoneNumber;
                if (action.payload.location) {
                    // Assuming you want to store location as an address or a separate field
                    // You might need to adjust this based on your actual data structure
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
                state.loading = false;
                // Optionally, handle post-registration logic
                // For example, auto-login or navigate to login screen
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            });
    },
});

export const registerUser = createAsyncThunk<
    ApiResponse, // Return type of the payload creator
    RegisterData, // First argument to the payload creator
    { rejectValue: string } // Type of the reject value
>(
    'user/register',
    async (registerData: RegisterData, {rejectWithValue}) => {
        try {
            const response = await fetch('http://192.168.1.3:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            const data: ApiResponse = await response.json();

            if (response.ok && data.success) {
                return data;
            } else {
                return rejectWithValue(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('API Registration Error:', error);
            return rejectWithValue('An error occurred during registration.');
        }
    }
);

// Export actions for use in components
export const {
    setPhoneNumber,
    setSelectedCode,
    setEmail,
    setName,
    setSurname,
    addToCart,
    removeFromCart,
    clearCart,
    addAddress,
    removeAddress,
    setCurrentAddress,
    logout,
} = userSlice.actions;

// Export the reducer to be included in the store
export default userSlice.reducer;
