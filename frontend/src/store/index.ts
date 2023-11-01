import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';

import { appSlice, authSlice, taskBoardSlice, flushAllStates } from './slices';
import { deleteAccount, signOut } from './thunks/auth';
import { apiResponseNotification } from './api/middleware';
import { api as taskApi } from './api/services/tasks';

const combinedReducer = combineReducers({
  app: appSlice.reducer,
  auth: authSlice.reducer,
  boards: taskBoardSlice.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: RootState | undefined,
  action: AnyAction
) => {
  const actionsWithReset = [
    flushAllStates().type,
    signOut.fulfilled.type,
    deleteAccount.fulfilled.type,
  ];

  if (actionsWithReset.includes(action.type)) {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /**
       *  If your state or actions are very large,
       *  the SerializableStateInvariantMiddleware,
       *  that causes a slowdown in dev, can be disabled
       */
      serializableCheck: false,
    }).concat([apiResponseNotification, taskApi.middleware]),
});

export type AppDispatch = typeof store.dispatch;

export default store;
