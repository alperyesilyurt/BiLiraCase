import { render, screen, waitFor } from '@testing-library/react';
import AssetTable from '../AssetTable';

test('renders table with asset data', async () => {
  render(<AssetTable />);

  await waitFor(() => {
    expect(screen.getByText(/BTC\/USDT/i)).toBeInTheDocument();
  });
});

test('highlights price increase', async () => {
  render(<AssetTable />);

  await waitFor(() => {
    expect(screen.getByText(/40000 USDT/i)).toHaveClass('text-green-600');
  });
});
