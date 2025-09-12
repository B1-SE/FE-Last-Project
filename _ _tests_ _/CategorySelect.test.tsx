import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategorySelect from '../src/components/CategorySelect';

describe('CategorySelect', () => {
  it('renders options and calls onChange', () => {
    const categories = ['electronics', 'clothing'];
    const onChange = vi.fn();

    render(<CategorySelect categories={categories} onChange={onChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('clothing')).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'electronics' } });
    expect(onChange).toHaveBeenCalledWith('electronics');
  });
});
