import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    getUserDataThunk,
    loginUserThunk,
    registerUserThunk,
    updateEmailThunk,
    updatePasswordThunk,
    updateUsernameThunk,
} from "@/src/redux/thunks/userThunks";
import {verifyCode} from "@/src/redux/api/authAPI";
import {UserState} from "@/src/types/states";


export interface UserDataResponse {
    user_data: {
        id: number;
        name: string;
        email: string;
        phone_number: string;
        role: string;
        email_verified: boolean;
    };
    user_address_list: Array<{
        id: number;
        title: string;
        longitude: number;
        latitude: number;
        street: string;
        neighborhood: string;
        district: string;
        province: string;
        country: string;
        postalCode: number;
        apartmentNo: number;
        doorNo: string;
        is_primary: boolean;
    }>;
}

const initialState: UserState = {
    email: '',
    name_surname: '',
    phoneNumber: '',
    selectedCode: '+90',
    password: '',
    passwordLogin: false,
    verificationCode: '',
    step: 'send_code',
    login_type: 'email',
    token: null,
    loading: false,
    error: null,
    role: 'customer',
    email_verified: false,
    isInitialized: false,
    shouldNavigateToLanding: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSelectedCode(state, action: PayloadAction<string>) {
            state.selectedCode = action.payload;
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
        setPhoneNumber(state, action: PayloadAction<string>) {
            state.phoneNumber = action.payload.replace(/[^0-9]/g, '').slice(0, 15);
            if (!state.phoneNumber && !state.email) {
                state.password = ''; // Clear password when both are empty
            }
        },
        setPassword(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        setPasswordLogin(state, action: PayloadAction<boolean>) {
            state.passwordLogin = action.payload;
        },
        setVerificationCode(state, action: PayloadAction<string>) {
            state.verificationCode = action.payload;
        },
        setStep(state, action: PayloadAction<"send_code" | "verify_code" | "skip_verification">) {
            state.step = action.payload;
        },
        setLoginType(state, action: PayloadAction<"email" | "phone_number">) {
            state.login_type = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
        logout: (state) => {
            state.shouldNavigateToLanding = true;
            return initialState;
        },
        resetNavigation: (state) => {
            state.shouldNavigateToLanding = false;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(loginUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;


            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Login failed';

            })
            .addCase(registerUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUserThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Registration failed';

            })
            .addCase(updateUsernameThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUsernameThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.name_surname = action.payload.message;
            })
            .addCase(updateUsernameThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update username';
            })
            .addCase(updateEmailThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmailThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.email = action.payload.message;
            })
            .addCase(updateEmailThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update email';
            })
            .addCase(updatePasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePasswordThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update password';
            })
            .addCase(getUserDataThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDataThunk.fulfilled, (state, action) => {
                state.name_surname = action.payload.user_data.name;
                state.email = action.payload.user_data.email;
                state.phoneNumber = action.payload.user_data.phone_number;
                state.role = "customer";
                state.email_verified = action.payload.user_data.email_verified
                state.loading = false;
                state.isInitialized = true;
            })
            .addCase(getUserDataThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch user data';
            })
            .addCase(verifyCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyCode.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Verification failed";
            });
    }
});

export const {
    setEmail,
    setName,
    setPhoneNumber,
    setPassword,
    setPasswordLogin,
    setSelectedCode,
    setVerificationCode,
    setStep,
    setLoginType,
    setToken,
    logout,
} = userSlice.actions;

export default userSlice.reducer;
