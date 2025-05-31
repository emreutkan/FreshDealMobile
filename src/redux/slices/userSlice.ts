import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    getUserDataThunk,
    getUserRankingsThunk,
    getUserRankThunk,
    loginUserThunk,
    registerUserThunk,
    updateEmailThunk,
    updatePasswordThunk,
    updateUsernameThunk,
} from "@/src/redux/thunks/userThunks";
import {verifyCode} from "@/src/redux/api/authAPI";
import {UserState} from "@/src/types/states";
import {CombinedAchievementsData} from '../thunks/achievementThunks';
import {UserRankResponse} from "@/src/redux/api/userAPI";


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
    isAuthenticated: false,
    foodSaved: 0,
    moneySaved: 0,
    achievements: [],
    achievementsLoading: false,
    totalDiscountEarned: 0,
    userId: 0,
    rank: 0,
    totalDiscount: 0,
    rankings: [],
    rankLoading: false,
    rankingsLoading: false,

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
                state.password = '';
            }
        },
        setName(state, action: PayloadAction<string>) {
            state.name_surname = action.payload;
        },
        setPhoneNumber(state, action: PayloadAction<string>) {
            state.phoneNumber = action.payload.replace(/[^0-9]/g, '').slice(0, 15);
            if (!state.phoneNumber && !state.email) {
                state.password = '';
            }
        },
        setPassword(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        setPasswordLogin(state, action: PayloadAction<boolean>) {
            state.passwordLogin = action.payload;
        },
        setLoginType(state, action: PayloadAction<"email" | "phone_number">) {
            state.login_type = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.shouldNavigateToLanding = true;
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase('user/logout', () => {
                return initialState;
            })
            .addCase(loginUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.isAuthenticated = true;
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
            .addCase(verifyCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyCode.fulfilled, (state) => {
                state.loading = false;
                state.email_verified = true;
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Verification failed';
            })
            .addCase(updateUsernameThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUsernameThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.name_surname = action.meta.arg.username;
            })
            .addCase(updateUsernameThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Failed to update username';
            })
            .addCase(updateEmailThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmailThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.email = action.meta.arg.new_email;
            })
            .addCase(updateEmailThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Failed to update email';
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
                state.error = action.error?.message || 'Failed to update password';
            })
            .addCase(getUserDataThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDataThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.name_surname = action.payload.user_data.name;
                state.email = action.payload.user_data.email;
                state.phoneNumber = action.payload.user_data.phone_number?.replace(state.selectedCode, '') || '';
                state.role = action.payload.user_data.role as 'customer';
                state.email_verified = action.payload.user_data.email_verified;
                state.isInitialized = true;
                state.userId = action.payload.user_data.id;

            })
            .addCase(getUserDataThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || 'Failed to get user data';
            })

            .addCase('achievements/fetchUserAchievements/pending', (state) => {
                state.achievementsLoading = true;
                state.error = null;
            })
            .addCase('achievements/fetchUserAchievements/fulfilled', (state, action: PayloadAction<CombinedAchievementsData>) => {
                state.achievementsLoading = false;
                state.achievements = action.payload.achievements.map(ach => ({
                    ...ach,
                    image_url: ach.badge_image_url, // Map badge_image_url to image_url
                    acquired: !!ach.earned_at // Determine acquired based on earned_at
                }));

            })
            .addCase('achievements/fetchUserAchievements/rejected', (state, action) => {
                state.achievementsLoading = false;
                state.error = action.error?.message || 'Failed to fetch achievements';
            })

            .addCase(getUserRankThunk.pending, (state) => {
                state.rankLoading = true;
            })
            .addCase(getUserRankThunk.fulfilled, (state, action: PayloadAction<UserRankResponse>) => {
                state.rankLoading = false;
                state.rank = action.payload.rank;
                state.totalDiscount = action.payload.total_discount;
            })
            .addCase(getUserRankThunk.rejected, (state) => {
                state.rankLoading = false;
            })
            // Adding the missing handlers for getUserRankingsThunk
            .addCase(getUserRankingsThunk.pending, (state) => {
                state.rankingsLoading = true;
                state.error = null;
            })
            .addCase(getUserRankingsThunk.fulfilled, (state, action: PayloadAction<UserRankResponse[]>) => {
                state.rankingsLoading = false;
                state.rankings = action.payload.map(rank => ({
                    user_id: rank.user_id,
                    name: rank.user_name, // Map user_name to name
                    total_discount_earned: rank.total_discount, // Map total_discount to total_discount_earned
                    rank: rank.rank
                }));
                console.log("Rankings stored in state:", action.payload);
            })
            .addCase(getUserRankingsThunk.rejected, (state, action) => {
                state.rankingsLoading = false;
                state.error = action.error?.message || 'Failed to fetch rankings';
                console.log("Error storing rankings:", action.error);
            })


    },

});

export const {
    setSelectedCode,
    setEmail,
    setName,
    setPhoneNumber,
    setPassword,
    setPasswordLogin,
    setLoginType,
    setToken,
    logout
} = userSlice.actions;

export default userSlice.reducer;

