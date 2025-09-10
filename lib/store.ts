import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import storageReducer from "./features/storage/storageSlice";
import { usersApi } from "./features/users/usersApi";
import { projectsApi } from "./features/projects/projectsApi";
import { ratingsApi } from "./features/ratings/ratingsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    storage: storageReducer,
    // Add all RTK Query API reducers
    [usersApi.reducerPath]: usersApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [ratingsApi.reducerPath]: ratingsApi.reducer,
  },
  // Add all RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(projectsApi.middleware)
      .concat(ratingsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
