import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface UserDetails {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
}

interface Location {
    latitude: number;
    longitude: number;
}

interface Address {
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
}

interface UserState {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    location: Location | null;
    addresses: Address[]; // Update addresses to hold Address type
    currentAddress: Address | null; // Add a new field for current address
    cart: CartItem[];
    favorites: string[];
}

const initialState: UserState = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    location: null,
    addresses: [],
    currentAddress: null, // Initialize new field
    cart: [],
    favorites: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action: PayloadAction<UserDetails>) => {
            state.name = action.payload.name;
            state.surname = action.payload.surname;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
        },
        setLocation: (state, action: PayloadAction<Location>) => {
            state.location = action.payload;
        },
        addAddress: (state, action: PayloadAction<Address>) => {
            state.addresses.push(action.payload);
        },
        removeAddress: (state, action: PayloadAction<string>) => {
            state.addresses = state.addresses.filter(address => address.street !== action.payload);
        },
        setCurrentAddress: (state, action: PayloadAction<Address>) => {
            state.currentAddress = action.payload;
        },
        addItemToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }
        },
        removeItemFromCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.cart = [];
        },
        addFavorite: (state, action: PayloadAction<string>) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter(item => item !== action.payload);
        },
        resetUser: (state) => {
            return initialState;
        },
    },
});

export const {
    setUserDetails,
    setLocation,
    addAddress,
    removeAddress,
    setCurrentAddress, // Export new action
    addItemToCart,
    removeItemFromCart,
    clearCart,
    addFavorite,
    removeFavorite,
    resetUser,
} = userSlice.actions;

export default userSlice.reducer;
