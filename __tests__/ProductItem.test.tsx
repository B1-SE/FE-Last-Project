import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductItem from '../src/components/ProductItem';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';

const product = {
  id: '1',
  title: 'Test Product',
  price: 9.99,
  category: 'Test Category',
  description: 'Test Description',
  image: 'broken-url',
  rating: { rate: 4.5, count: 10 },
};

describe('ProductItem', () => {
  it('renders product details and fallback image', () => {
    render(
      <Provider store={store}>
        <ProductItem product={product} />
      </Provider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    // Fallback image
    const img = screen.getByAltText('Test Product') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src).toContain('via.placeholder.com');
  });
});
