import {
  type UnknownAction,
  configureStore,
  combineSlices,
} from '@reduxjs/toolkit';

import { envIs } from '@/utils/app';
import { logger } from './middleware';
import {
  appSlice,
  authSlice,
  taskBoardSlice,
  flushAllStates,
  taskListSlice,
} from './slices';
import { deleteAccount } from './thunks/auth';
import { apiResponseNotification } from './api/middleware';
import { api as taskApi } from './api/services/tasks';

// cf. https://redux-toolkit.js.org/api/combineSlices
const combinedReducer = combineSlices(
  appSlice,
  authSlice,
  taskListSlice,
  taskApi,
  {
    boards: taskBoardSlice.reducer,
  }
);

export type RootState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: RootState | undefined,
  action: UnknownAction
) => {
  const actionsWithReset = [
    flushAllStates().type,
    deleteAccount.fulfilled.type,
  ];

  if (actionsWithReset.includes(action.type)) {
    state = undefined;
  }
  return combinedReducer(state, action);
};

/**
 * Create a configured Redux store.
 */
export const setupStore = () => {
  // cf. https://redux.js.org/usage/usage-with-typescript#typing-configurestore
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        /**
         *  If your state or actions are very large,
         *  the SerializableStateInvariantMiddleware,
         *  that causes a slowdown in dev, can be disabled
         */
        // serializableCheck: false,
      }).concat([
        apiResponseNotification,
        taskApi.middleware,
        ...(envIs('development') ? [logger] : []),
      ]),
  });
};

export const store = setupStore();

export type AppDispatch = ReturnType<typeof setupStore>['dispatch'];

export default store;
