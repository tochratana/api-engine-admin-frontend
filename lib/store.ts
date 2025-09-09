import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth/authSlice"
import usersReducer from "./features/users/usersSlice"
import projectsReducer from "./features/projects/projectsSlice"
import ratingsReducer from "./features/ratings/ratingsSlice"
import storageReducer from "./features/storage/storageSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    ratings: ratingsReducer,
    storage: storageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
