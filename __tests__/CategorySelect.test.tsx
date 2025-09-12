import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelect from '../src/components/CategorySelect';

describe('CategorySelect', () => {
  it('renders categories and calls onChange', () => {
    const categories = ['electronics', 'jewelery'];
    const onChange = jest.fn();
    render(<CategorySelect categories={categories} onChange={onChange} />);
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'electronics' } });
    expect(onChange).toHaveBeenCalledWith('electronics');
  });
});
