import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import App from '../../App';

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe('MedFinance mobile app', () => {
  const mockContent = {
    student: [
      { id: 'budget-roadmap', title: 'Roteiro de orçamento pessoal', description: '...' },
      { id: 'residency-investments', title: 'Investimentos para residentes', description: '...' },
      { id: 'tax-essentials', title: 'Essenciais de tributação médica', description: '...' }
    ],
    admin: [
      { id: 'budget-roadmap', title: 'Roteiro de orçamento pessoal', description: '...' },
      { id: 'clinic-cashflow', title: 'Fluxo de caixa do consultório', description: '...' },
      { id: 'tax-essentials', title: 'Essenciais de tributação médica', description: '...' }
    ]
  };

  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      const profile = url.includes('profile=admin') ? 'admin' : 'student';

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: mockContent[profile] })
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts with zero balance', async () => {
    const { getByText } = render(<App />);

    await act(async () => {
      await flushPromises();
    });

    expect(getByText(/Saldo atual: R\$0.00/)).toBeTruthy();
  });

  it('updates balance when actions are pressed', async () => {
    const { getByText } = render(<App />);

    await act(async () => {
      await flushPromises();
    });

    fireEvent.press(getByText('Adicionar R$100'));
    expect(getByText(/Saldo atual: R\$100.00/)).toBeTruthy();

    fireEvent.press(getByText('Remover R$50'));
    expect(getByText(/Saldo atual: R\$50.00/)).toBeTruthy();
  });

  it('shows recommended content for each profile', async () => {
    const { getByText } = render(<App />);

    await act(async () => {
      await flushPromises();
    });

    await waitFor(() => {
      expect(getByText('Investimentos para residentes')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Gestor'));
      await flushPromises();
    });

    await waitFor(() => {
      expect(getByText('Fluxo de caixa do consultório')).toBeTruthy();
    });
  });
});
