import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, beforeEach, vi } from 'vitest';
import App from '../App';

describe('App', () => {
  const mockContent = {
    student: [
      { id: 'budget-roadmap', title: 'Roteiro de orçamento pessoal', description: '...' },
      { id: 'residency-investments', title: 'Investimentos para residentes', description: '...' },
      { id: 'tax-essentials', title: 'Essenciais de tributação médica', description: '...' }
    ],
    admin: [
      { id: 'budget-roadmap', title: 'Roteiro de orçamento pessoal', description: '...' },
      { id: 'clinic-cashflow', title: 'Fluxo de caixa do consultório', description: '...' },
      { id: 'tax-essentials', title: 'Essenciais de tributação médica', description: '...' },
      { id: 'team-performance', title: 'Performance da equipe assistencial', description: '...' }
    ]
  } as const;

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation((input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString();
      const profile = url.includes('profile=admin') ? 'admin' : 'student';

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: mockContent[profile as 'admin' | 'student'] })
      }) as unknown as Promise<Response>;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders hero copy', async () => {
    render(<App />);
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole('heading', { name: 'MedFinance' })).toBeInTheDocument();
    expect(screen.getByText(/organizar suas finanças pessoais/i)).toBeInTheDocument();

    await act(async () => {
      await waitFor(() => expect(screen.queryByText('Carregando recomendações...')).not.toBeInTheDocument());
    });
  });

  it('lists personalized recommendations for the default profile', async () => {
    render(<App />);
    await act(async () => {
      await Promise.resolve();
    });

    const cards = await screen.findAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(3);
    expect(screen.getByText('Investimentos para residentes')).toBeInTheDocument();
  });

  it('updates recommendations when profile changes', async () => {
    render(<App />);
    await act(async () => {
      await Promise.resolve();
    });

    await screen.findByText('Investimentos para residentes');

    await act(async () => {
      await userEvent.selectOptions(screen.getByLabelText('Perfil:'), 'admin');
    });

    expect(await screen.findByText('Fluxo de caixa do consultório')).toBeInTheDocument();
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(4);

    await act(async () => {
      await waitFor(() => expect(screen.queryByText('Carregando recomendações...')).not.toBeInTheDocument());
    });
  });
});
