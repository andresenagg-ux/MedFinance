import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders hero copy', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'MedFinance' })).toBeInTheDocument();
    expect(screen.getByText(/organizar suas finanças pessoais/i)).toBeInTheDocument();
  });

  it('lists feature highlights', () => {
    render(<App />);

    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(3);
  });
});
