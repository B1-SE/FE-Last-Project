import { Middleware } from 'redux';
import { RootState } from './store';

export const sessionStorageMiddleware: Middleware<{}, RootState> = store => next => action => {
  const result = next(action);
  if (action.type.startsWith('cart/')) {
    try {
      const cartState = store.getState().cart;
      sessionStorage.setItem('cart', JSON.stringify(cartState));
    } catch (e) {
      console.warn('Could not save cart state to session storage', e);
    }
  }
  return result;
};
