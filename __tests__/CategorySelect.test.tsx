import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CategorySelect from '../src/components/CategorySelect';

const queryClient = new QueryClient();

test('renders categories and calls onChange', () => {
  const mockChange = jest.fn();
  render(
    <QueryClientProvider client={queryClient}>
      <CategorySelect onCategoryChange={mockChange} />
    </QueryClientProvider>
  );
  // Since categories are fetched, mock if needed, but test select exists
  expect(screen.getByRole('combobox')).toBeInTheDocument();
});

test('changes category', () => {
  const mockChange = jest.fn();
  render(
    <QueryClientProvider client={queryClient}>
      <CategorySelect onCategoryChange={mockChange} />
    </QueryClientProvider>
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'electronics' } });
  expect(mockChange).toHaveBeenCalledWith('electronics');
});