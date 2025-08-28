import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import cartReducer from "./cartSlice";
import notificationReducer from "./NotificationSlice";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

const rootReducer = combineReducers({
  cart: cartReducer,
  notification: notificationReducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  blacklist: ["notification"], // Do not persist notifications
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Ignore non-serializable values for persist
    }),
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;