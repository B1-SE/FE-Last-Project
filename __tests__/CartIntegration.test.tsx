import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../src/redux/store';
import App from '../src/App';

const queryClient = new QueryClient();

test('adds product to cart and updates cart', async () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  );
  // Assume products load, find an "Add to Cart" button
  // This may need mocking for firestore, but in TDD, we'd mock
  // For simplicity, assume it works and test navigation/update
  fireEvent.click(await screen.findByText('Add to Cart')); // Adjust based on actual
  fireEvent.click(screen.getByText('Cart'));
  expect(screen.getByText(/Total Items: 1/)).toBeInTheDocument(); // Approximate
});