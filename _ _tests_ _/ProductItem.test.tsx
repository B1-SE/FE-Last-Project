import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductItem from '../src/components/ProductItem';
import { addToCart } from '../src/redux/cartSlice';
import type { Product } from '../src/types/types';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/redux/cartSlice';

describe('ProductItem', () => {
  let store: ReturnType<typeof configureStore>;
  let dispatchSpy: any;

  const mockProduct: Product = {
    id: 'p1',
    title: 'Test Product',
    price: 19.99,
    category: 'Gadgets',
    description: 'A neat test gadget.',
    image: 'https://example.com/img.png',
    rating: { rate: 4.2, count: 57 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({ reducer: { cart: cartReducer } });
    dispatchSpy = vi.spyOn(store, 'dispatch');
  });

  it('renders product details', () => {
    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );

    expect(screen.getByRole('img', { name: /test product/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /test product/i })).toBeInTheDocument();
    expect(screen.getByText(/\$19\.99/)).toBeInTheDocument();
    expect(screen.getByText(/Gadgets/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('dispatches addToCart with quantity 1 when clicking Add to Cart', () => {
    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    // Cast to 'any' to bypass the type error for test purposes
    expect(dispatchSpy).toHaveBeenCalledWith(addToCart({ ...mockProduct, quantity: 1 } as any));
  });
});
