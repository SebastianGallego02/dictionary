import { configureStore } from "@reduxjs/toolkit";
import dictionaryReducer from "../redux/features/dictionarySlice";
import { dictionaryApi } from "./services/dictionaryApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    dictionaryReducer,
    [dictionaryApi.reducerPath]: dictionaryApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([dictionaryApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;