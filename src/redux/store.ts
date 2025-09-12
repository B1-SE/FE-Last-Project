import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { sessionStorageMiddleware } from './sessionStorageMiddleware';

// 1. Combine reducers to create a single root reducer.
const rootReducer = combineReducers({
  cart: cartReducer,
});

// 2. Infer the `RootState` type from the root reducer *before* creating the store.
// This breaks the circular dependency that was causing the errors.
export type RootState = ReturnType<typeof rootReducer>;

const loadState = (): RootState | undefined => {
  try {
    const serializedCart = sessionStorage.getItem('cart');
    if (serializedCart === null) {
      return undefined; // No state in session storage
    }
    // The preloaded state must match the shape of the root state.
    return { cart: JSON.parse(serializedCart) };
  } catch (err) {
    console.warn('Could not load state from session storage', err);
    return undefined;
  }
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sessionStorageMiddleware),
  preloadedState: loadState(),
});

// AppDispatch can still be safely inferred from the final store.
export type AppDispatch = typeof store.dispatch;