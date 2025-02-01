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


    },
});

export const {
    setPushToken,
    setIsRegistered,

} = notificationSlice.actions;

export default notificationSlice.reducer;