import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import ProductItem from '../src/components/ProductItem';
import Cart from '../src/components/Cart';
import { Product } from '../src/types/types';

describe('Cart Integration', () => {
  it('adds product to cart and updates cart', () => {
    const product: Product = {
      id: '1',
      title: 'Integration Product',
      price: 19.99,
      category: 'integration',
      description: 'Integration test',
      image: 'broken-url',
      rating: { rate: 4.5, count: 10 },
    };
    render(
      <Provider store={store}>
        <>
          <ProductItem product={product} />
          <Cart />
        </>
      </Provider>
    );
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    expect(screen.getByText('Integration Product')).toBeInTheDocument();
    expect(screen.getByText('Total Items: 1')).toBeInTheDocument();
    expect(screen.getByText('Total Price: $19.99')).toBeInTheDocument();
  });
});
