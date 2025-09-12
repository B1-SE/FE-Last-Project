import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Cart from '../src/pages/Cart';
import ProductItem from '../src/components/ProductItem';
import { store } from '../src/redux/store';
import type { Product } from '../src/types/types';

const queryClient = new QueryClient();

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{ui}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

describe('Cart integration', () => {
  it('updates cart count and total when adding a product', () => {
    const product: Product = {
      id: 'abc',
      title: 'Demo Product',
      price: 25,
      category: 'Demo',
      description: 'desc',
      image: 'img',
      rating: { rate: 4, count: 10 },
    };

    // Render ProductItem then Cart in the same provider tree (shared store)
    renderWithProviders(
      <div>
        <ProductItem product={product} />
        <Cart />
      </div>
    );

    // Initially empty cart in UI
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

    // Add to cart
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    // Cart should reflect totals
    expect(screen.getByText(/total items: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/total price: \$25\.00/i)).toBeInTheDocument();
  });
});
