import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from './App';

describe('Mobile App', () => {
  it('shows the main headline and description', () => {
    render(<App />);

    expect(screen.getByRole('header', { name: /MedFinance Mobile/i })).toBeTruthy();
    expect(screen.getByText(/indicadores financeiros/i)).toBeTruthy();
  });
});
