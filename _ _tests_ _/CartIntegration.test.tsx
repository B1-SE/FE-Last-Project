import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Cart from '../src/components/Cart';
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
  it('adds a product to the cart and updates summary', () => {
    const product: Product = {
      id: 'abc',
      title: 'Demo Product',
      price: 25,
      category: 'Demo',
      description: 'desc',
      image: 'img',
      rating: { rate: 4, count: 10 },
    };

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

    // Cart summary should now show correct totals
    const cartSummary = screen.getByText(/total items:/i).closest('div')?.parentElement;
    expect(cartSummary).toBeTruthy();
    const summaryText = cartSummary?.textContent?.replace(/\s+/g, ' ');
    expect(summaryText).toMatch(/Total Items: 1/i);
    expect(summaryText).toMatch(/Total Price: \$25\.00/i);
  });
});
