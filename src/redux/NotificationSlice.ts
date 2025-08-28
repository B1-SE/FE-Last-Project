import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Notification {
    message: string;
    type: 'success' | 'error';
}

interface NotificationState {
    notification: Notification | null;
}

const initialState: NotificationState = {
    notification: null
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action: PayloadAction<Notification>) => {
            state.notification = action.payload;
        },
        clearNotification: (state) => {
            state.notification = null;
        }
    }
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;