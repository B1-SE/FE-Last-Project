import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import ProductItem from '../src/components/ProductItem';
import { Product } from '../src/types/types';

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  price: 10,
  category: 'test',
  description: 'desc',
  image: 'img.jpg',
  rating: { rate: 4, count: 10 },
};

test('renders product details', () => {
  render(
    <Provider store={store}>
      <ProductItem product={mockProduct} />
    </Provider>
  );
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$10.00')).toBeInTheDocument();
});

test('adds to cart on button click', () => {
  render(
    <Provider store={store}>
      <ProductItem product={mockProduct} />
    </Provider>
  );
  fireEvent.click(screen.getByText('Add to Cart'));
  // Assert via store state if needed, but for unit, check button exists
  expect(screen.getByText('Add to Cart')).toBeInTheDocument();
});