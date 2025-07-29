import { configureStore } from "@reduxjs/toolkit";
import { createApiSlide } from "../apiSlide/apiSlide";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer : {
    [createApiSlide.reducerPath] : createApiSlide.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createApiSlide.middleware),
})


setupListeners(store.dispatch)