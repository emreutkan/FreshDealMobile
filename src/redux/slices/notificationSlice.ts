import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface NotificationState {
    pushToken?: string;
    isRegistered: boolean;
    lastNotification?: {
        title: string;
        body: string;
        data?: any;
    };
}

const initialState: NotificationState = {
    pushToken: undefined,
    isRegistered: false,
    lastNotification: undefined,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setPushToken: (state, action: PayloadAction<string>) => {
            state.pushToken = action.payload;
        },
        setIsRegistered: (state, action: PayloadAction<boolean>) => {
            state.isRegistered = action.payload;
        },
        setLastNotification: (state, action: PayloadAction<{
            title: string;
            body: string;
            data?: any;
        }>) => {
            state.lastNotification = action.payload;
        },
        resetNotificationState: (state) => {
            state.pushToken = undefined;
            state.isRegistered = false;
            state.lastNotification = undefined;
        },
    },
});

export const {
    setPushToken,
    setIsRegistered,
    setLastNotification,
    resetNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;