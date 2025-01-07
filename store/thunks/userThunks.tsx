import {createAsyncThunk} from '@reduxjs/toolkit';
import {
    getUserDataAPI,
    loginUserAPI,
    registerUserAPI,
    updateEmailAPI,
    updatePasswordAPI,
    updateUsernameAPI,
} from "@/api/userAPI";
import {RootState} from "@/store/store";
import {UserDataResponse} from "@/store/slices/userSlice";
import {getRestaurantsByProximity} from "@/store/thunks/restaurantThunks";

// Login user
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
        {dispatch, rejectWithValue}
    ) => {
        try {
            const response = await loginUserAPI(payload);
            const token = response.token;
            dispatch(getUserData({token}));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

// Register user
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (
        userData: {
            name_surname: string;
            email?: string;
            phone_number?: string;
            password: string;
            role: "customer";
        },
        {rejectWithValue}
    ) => {
        try {
            return await registerUserAPI(userData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);
// -------------------------------------------------------------------
// 3) Update username
// -------------------------------------------------------------------
export const updateUsername = createAsyncThunk<
    { username: string },
    { newUsername: string },
    { state: RootState; rejectValue: string; dispatch: any }  // <== Notice "dispatch" here
>(
    'user/updateUsername',
    async ({newUsername}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            const response = await updateUsernameAPI(newUsername, token);

            dispatch(getUserData({token}));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update username');
        }
    }
);
// -------------------------------------------------------------------
// 4) Update email
// -------------------------------------------------------------------
export const updateEmail = createAsyncThunk<
    { email: string },
    { oldEmail: string; newEmail: string },
    { state: RootState; rejectValue: string; dispatch: any } // <== Notice "dispatch" here
>(
    'user/updateEmail',
    async ({oldEmail, newEmail}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            const response = await updateEmailAPI(oldEmail, newEmail, token);

            dispatch(getUserData({token}));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update email');
        }
    }
);

// -------------------------------------------------------------------
// 5) Update password
// -------------------------------------------------------------------
export const updatePassword = createAsyncThunk<
    { message: string },
    { oldPassword: string; newPassword: string },
    { state: RootState; rejectValue: string; dispatch: any } // <== Notice "dispatch" here
>(
    'user/updatePassword',
    async ({oldPassword, newPassword}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            const response = await updatePasswordAPI(oldPassword, newPassword, token);

            dispatch(getUserData({token}));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update password');
        }
    }
);
// Get user data
export const getUserData = createAsyncThunk<
    UserDataResponse,
    { token: string },
    { rejectValue: string }
>(
    'user/getUserData',
    async ({token}, {dispatch, rejectWithValue}) => {
        try {
            const response = await getUserDataAPI(token);
            // at this point, when the getuserdata is fulfilled, we can dispatch another action
            // when getuserdata is fulfilled in the address slice the primary address is set if user has an address
            // so we get that primary address and dispatch the getRestaurantsByProximity action

            if (response.user_address_list.length > 0) {
                // we need to get the primary address from addresss slice
                // then we can dispatch the getRestaurantsByProximity action
                const primaryAddress = response.user_address_list.find((address) => address.is_primary);
                if (primaryAddress) {
                    const address = response.user_address_list.find((address) => address.id === primaryAddress.id);
                    if (address) {
                        const resultAction = await dispatch(getRestaurantsByProximity({
                            latitude: address.latitude,
                            longitude: address.longitude,
                            radius: 100
                        }));
                        if (getRestaurantsByProximity.fulfilled.match(resultAction)) {
                            console.log('%c[Success] Restaurants fetched successfully.', 'color: green; font-weight: bold;');
                        } else {
                            console.error('%c[Error] Failed to fetch restaurants.', 'color: red; font-weight: bold;');
                            if (resultAction.payload) {
                                console.error('%c[Error Details]', 'color: red; font-weight: bold;', resultAction.payload);
                            }
                        }

                    }
                }
                return response;
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user data');
        }
    }
);
