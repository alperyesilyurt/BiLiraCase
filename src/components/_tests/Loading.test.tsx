import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Loading from '../Loading';

test('renders Loading component', () => {
  render(<Loading />);
  const loadingElement = screen.getByTestId('loading');
  expect(loadingElement).toBeInTheDocument();
});
