import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { usersApi } from "./features/users/usersApi";
import { projectsApi } from "./features/projects/projectsApi";
import { ratingsApi } from "./features/ratings/ratingsApi";
import { storageApi } from "./features/storage/storageApi"; // Import the RTK Query API

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add all RTK Query API reducers
    [usersApi.reducerPath]: usersApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [ratingsApi.reducerPath]: ratingsApi.reducer,
    [storageApi.reducerPath]: storageApi.reducer, // Add storage API reducer
  },
  // Add all RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(projectsApi.middleware)
      .concat(ratingsApi.middleware)
      .concat(storageApi.middleware), // Add storage API middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
