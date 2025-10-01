import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';

describe('MedFinance mobile app', () => {
  it('starts with zero balance', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Saldo atual: R\$0.00/)).toBeTruthy();
  });

  it('updates balance when actions are pressed', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('Adicionar R$100'));
    expect(getByText(/Saldo atual: R\$100.00/)).toBeTruthy();

    fireEvent.press(getByText('Remover R$50'));
    expect(getByText(/Saldo atual: R\$50.00/)).toBeTruthy();
  });
});
