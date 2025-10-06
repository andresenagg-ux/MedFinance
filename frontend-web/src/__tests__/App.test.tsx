import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Cursos MedFinance', () => {
  it('exibe o herói da página de cursos com ações principais', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /cursos medfinance/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /transforme sua relação com finanças, investimentos e gestão de carreira médica/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver trilhas disponíveis/i })).toHaveAttribute('href', '#cursos');
  });

  it('lista os cursos em destaque por padrão', () => {
    render(<App />);

    expect(
      screen.getByRole('article', {
        name: /estratégias financeiras para clínicas e consultórios/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('article', { name: /fundamentos de finanças pessoais para residentes/i })
    ).toBeInTheDocument();
  });

  it('filtra cursos quando uma trilha é selecionada', async () => {
    const user = userEvent.setup();
    render(<App />);

    await act(async () => {
      await user.click(screen.getByRole('tab', { name: /investimentos médicos/i }));
    });

    const courseRegion = screen.getByRole('region', { name: /cursos em destaque/i });

    await waitFor(() => {
      const filteredCourses = within(courseRegion).getAllByRole('article');
      expect(filteredCourses).toHaveLength(2);
      expect(filteredCourses[0]).toHaveAccessibleName(/investimentos e proteção de patrimônio médico/i);
      expect(filteredCourses[1]).toHaveAccessibleName(/fundamentos de finanças pessoais para residentes/i);
    });
  });
});
