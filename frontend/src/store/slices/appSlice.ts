import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AlertColor } from '@mui/material';

type Notification = {
  id: string | number;
  severity: AlertColor;
  message: string;
};

type AppState = {
  httpStatus?: number;
  intendedUrl?: string;
  messages: Notification[];
};

const initialState: AppState = {
  messages: [],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setHttpStatus(state, action: PayloadAction<AppState['httpStatus']>) {
      state.httpStatus = action.payload;
    },
    clearHttpStatus(state) {
      state.httpStatus = undefined;
    },
    /** Add new messages */
    pushNotification(
      state,
      action: PayloadAction<Omit<Notification, 'id'>>
    ): void {
      state.messages = [
        ...state.messages,
        { id: new Date().getTime(), ...action.payload },
      ];
    },
    /** Remove the first element of the messages */
    removeNotification(state): void {
      state.messages = state.messages.filter((_, i) => i !== 0);
    },
  },
});

export const {
  setHttpStatus,
  clearHttpStatus,
  pushNotification,
  removeNotification,
} = appSlice.actions;
