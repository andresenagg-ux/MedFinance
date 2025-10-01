import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main title and tips list', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /medfinance/i })).toBeInTheDocument();
    expect(screen.getByText(/Educação financeira/i)).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });
});
