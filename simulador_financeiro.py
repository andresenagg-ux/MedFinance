"""Simulador financeiro para profissionais da saúde.

Este módulo oferece classes para modelar fontes de renda, despesas e
investimentos ao longo do tempo, permitindo simulações de formação de
patrimônio, construção de reservas de emergência e amortização de dívidas.

Além das classes principais, um pequeno utilitário de linha de comando
permite executar simulações rápidas a partir de um arquivo JSON de
configuração ou utilizar um cenário padrão pensado para médicos em início de
carreira.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
import argparse
import json
from typing import Dict, Iterable, List, Optional


@dataclass
class IncomeSource:
    """Representa uma fonte de renda mensal.

    Args:
        name: Identificação da fonte de renda.
        monthly_amount: Valor recebido por mês.
        annual_growth: Crescimento percentual anual da renda.
    """

    name: str
    monthly_amount: float
    annual_growth: float = 0.0

    def amount_for_year(self, year_index: int) -> float:
        """Retorna a renda mensal correspondente ao ano informado."""
        return self.monthly_amount * ((1 + self.annual_growth) ** year_index)


@dataclass
class Expense:
    """Representa uma despesa mensal recorrente."""

    name: str
    monthly_amount: float
    annual_growth: float = 0.0

    def amount_for_year(self, year_index: int) -> float:
        """Retorna o custo mensal correspondente ao ano informado."""
        return self.monthly_amount * ((1 + self.annual_growth) ** year_index)


@dataclass
class InvestmentPlan:
    """Configura o investimento periódico dos excedentes."""

    name: str
    monthly_contribution: float
    expected_return: float
    initial_balance: float = 0.0

    def monthly_return_rate(self) -> float:
        """Retorna a taxa de retorno mensal equivalente à taxa anual."""
        if self.expected_return <= -1:
            raise ValueError("expected_return deve ser maior que -100%")
        return (1 + self.expected_return) ** (1 / 12) - 1


@dataclass
class FinancialPlan:
    """Estrutura principal de planejamento financeiro."""

    incomes: Iterable[IncomeSource] = field(default_factory=list)
    expenses: Iterable[Expense] = field(default_factory=list)
    investment_plan: Optional[InvestmentPlan] = None
    emergency_reserve_months: int = 6
    debt_interest: float = 0.12
    initial_debt: float = 0.0

    def simulate(self, years: int) -> "SimulationResult":
        """Executa a simulação mês a mês."""
        if years <= 0:
            raise ValueError("years deve ser maior que zero")

        incomes = list(self.incomes)
        expenses = list(self.expenses)

        months: List[Dict[str, float]] = []
        total_income = 0.0
        total_expenses = 0.0
        total_contributed = 0.0
        total_debt_payment = 0.0

        investment_balance = (
            self.investment_plan.initial_balance if self.investment_plan else 0.0
        )
        investment_rate = (
            self.investment_plan.monthly_return_rate()
            if self.investment_plan
            else 0.0
        )
        debt_balance = max(self.initial_debt, 0.0)
        monthly_debt_rate = (1 + self.debt_interest) ** (1 / 12) - 1 if self.debt_interest else 0.0
        emergency_fund = 0.0
        cash_buffer = 0.0

        for month in range(years * 12):
            year_index = month // 12
            monthly_income = sum(source.amount_for_year(year_index) for source in incomes)
            monthly_expense = sum(expense.amount_for_year(year_index) for expense in expenses)
            net_cash_flow = monthly_income - monthly_expense
            total_income += monthly_income
            total_expenses += monthly_expense

            reserve_target = monthly_expense * self.emergency_reserve_months

            investment_growth = 0.0
            if self.investment_plan:
                previous_balance = investment_balance
                investment_balance *= 1 + investment_rate
                investment_growth = investment_balance - previous_balance

            debt_interest_amount = 0.0
            if debt_balance > 0 and monthly_debt_rate:
                debt_interest_amount = debt_balance * monthly_debt_rate
                debt_balance += debt_interest_amount

            cash_buffer_before = cash_buffer
            available_cash_before = net_cash_flow + cash_buffer_before
            available_cash = available_cash_before

            reserve_allocation = 0.0
            debt_payment = 0.0
            contribution = 0.0
            withdraw_from_reserve = 0.0
            withdraw_from_investment = 0.0

            if available_cash >= 0:
                if reserve_target > 0:
                    reserve_allocation = min(
                        available_cash, max(0.0, reserve_target - emergency_fund)
                    )
                    emergency_fund += reserve_allocation
                    available_cash -= reserve_allocation

                if debt_balance > 0 and available_cash > 0:
                    debt_payment = min(available_cash, debt_balance)
                    debt_balance -= debt_payment
                    available_cash -= debt_payment
                    total_debt_payment += debt_payment

                if self.investment_plan and available_cash > 0:
                    contribution = min(
                        available_cash, self.investment_plan.monthly_contribution
                    )
                    investment_balance += contribution
                    available_cash -= contribution
                    total_contributed += contribution

                cash_buffer = available_cash
            else:
                deficit = -available_cash
                cash_buffer = 0.0

                withdraw_from_reserve = min(deficit, emergency_fund)
                emergency_fund -= withdraw_from_reserve
                deficit -= withdraw_from_reserve

                if self.investment_plan and deficit > 0:
                    withdraw_from_investment = min(deficit, investment_balance)
                    investment_balance -= withdraw_from_investment
                    deficit -= withdraw_from_investment

                if deficit > 0:
                    debt_balance += deficit
                available_cash = 0.0

            months.append(
                {
                    "month": month + 1,
                    "year": year_index + 1,
                    "income": monthly_income,
                    "expenses": monthly_expense,
                    "net_cash_flow": net_cash_flow,
                    "reserve_target": reserve_target,
                    "emergency_fund": emergency_fund,
                    "investment_balance": investment_balance,
                    "investment_growth": investment_growth,
                    "investment_contribution": contribution,
                    "withdraw_from_investment": withdraw_from_investment,
                    "debt_balance": debt_balance,
                    "debt_interest": debt_interest_amount,
                    "debt_payment": debt_payment,
                    "reserve_allocation": reserve_allocation,
                    "withdraw_from_reserve": withdraw_from_reserve,
                    "cash_buffer_before": cash_buffer_before,
                    "cash_buffer": cash_buffer,
                    "available_cash_before": available_cash_before,
                    "available_cash_after": available_cash,
                }
            )

        return SimulationResult(
            years=years,
            months=months,
            total_income=total_income,
            total_expenses=total_expenses,
            total_contributed=total_contributed,
            total_debt_payment=total_debt_payment,
        )


def _format_currency(value: float) -> str:
    return f"R$ {value:,.2f}".replace(",", "@").replace(".", ",").replace("@", ".")


@dataclass
class SimulationResult:
    """Armazena o resultado consolidado da simulação."""

    years: int
    months: List[Dict[str, float]]
    total_income: float
    total_expenses: float
    total_contributed: float
    total_debt_payment: float

    def final_snapshot(self) -> Dict[str, float]:
        """Retorna os saldos do último mês simulado."""
        if not self.months:
            return {
                "emergency_fund": 0.0,
                "investment_balance": 0.0,
                "debt_balance": 0.0,
                "cash_buffer": 0.0,
            }
        last = self.months[-1]
        return {
            "emergency_fund": last["emergency_fund"],
            "investment_balance": last["investment_balance"],
            "debt_balance": last["debt_balance"],
            "cash_buffer": last["cash_buffer"],
        }

    def format_summary(self) -> str:
        """Gera uma tabela textual com os principais indicadores."""
        final = self.final_snapshot()
        lines = [
            "=== Resumo do Plano Financeiro ===",
            f"Anos simulados: {self.years}",
            f"Total recebido: {_format_currency(self.total_income)}",
            f"Total gasto: {_format_currency(self.total_expenses)}",
            f"Saldo final investido: {_format_currency(final['investment_balance'])}",
            f"Reserva de emergência: {_format_currency(final['emergency_fund'])}",
            f"Saldo de dívidas: {_format_currency(final['debt_balance'])}",
            f"Contribuições em investimentos: {_format_currency(self.total_contributed)}",
            f"Pagamentos da dívida: {_format_currency(self.total_debt_payment)}",
            f"Caixa livre ao final: {_format_currency(final['cash_buffer'])}",
        ]
        return "\n".join(lines)

    def yearly_totals(self) -> List[Dict[str, float]]:
        """Retorna indicadores agregados por ano."""
        totals: List[Dict[str, float]] = []
        for year in range(1, self.years + 1):
            year_months = [month for month in self.months if month["year"] == year]
            totals.append(
                {
                    "year": year,
                    "income": sum(month["income"] for month in year_months),
                    "expenses": sum(month["expenses"] for month in year_months),
                    "average_cash_buffer": sum(
                        month["cash_buffer"] for month in year_months
                    )
                    / len(year_months),
                    "ending_emergency_fund": year_months[-1]["emergency_fund"],
                    "ending_debt_balance": year_months[-1]["debt_balance"],
                    "ending_investment_balance": year_months[-1]["investment_balance"],
                }
            )
        return totals


def load_plan_from_json(path: Path) -> FinancialPlan:
    """Carrega uma configuração de planejamento a partir de um JSON."""
    data = json.loads(path.read_text(encoding="utf-8"))
    incomes = [IncomeSource(**item) for item in data.get("incomes", [])]
    expenses = [Expense(**item) for item in data.get("expenses", [])]

    investment_plan_data = data.get("investment_plan")
    investment_plan = (
        InvestmentPlan(**investment_plan_data) if investment_plan_data else None
    )

    return FinancialPlan(
        incomes=incomes,
        expenses=expenses,
        investment_plan=investment_plan,
        emergency_reserve_months=data.get("emergency_reserve_months", 6),
        debt_interest=data.get("debt_interest", 0.12),
        initial_debt=data.get("initial_debt", 0.0),
    )


def default_medical_plan() -> FinancialPlan:
    """Cria um cenário padrão inspirado em médicos em início de carreira."""
    incomes = [
        IncomeSource(name="Plantões e consultório", monthly_amount=28000, annual_growth=0.04),
        IncomeSource(name="Procedimentos", monthly_amount=5000, annual_growth=0.05),
    ]
    expenses = [
        Expense(name="Custo do consultório", monthly_amount=8000, annual_growth=0.03),
        Expense(name="Equipe e secretariado", monthly_amount=4500, annual_growth=0.04),
        Expense(name="Educação continuada", monthly_amount=1500, annual_growth=0.02),
        Expense(name="Despesas pessoais", monthly_amount=9000, annual_growth=0.03),
    ]
    investment_plan = InvestmentPlan(
        name="Fundos imobiliários e renda fixa",
        monthly_contribution=6000,
        expected_return=0.075,
        initial_balance=40000,
    )
    return FinancialPlan(
        incomes=incomes,
        expenses=expenses,
        investment_plan=investment_plan,
        emergency_reserve_months=6,
        debt_interest=0.18,
        initial_debt=20000,
    )


def run_cli() -> None:
    parser = argparse.ArgumentParser(
        description="Simulador financeiro para profissionais da saúde"
    )
    parser.add_argument(
        "--config",
        type=Path,
        help="Arquivo JSON com a configuração da simulação",
    )
    parser.add_argument(
        "--years",
        type=int,
        default=10,
        help="Quantidade de anos a simular (padrão: 10)",
    )
    parser.add_argument(
        "--show-yearly",
        action="store_true",
        help="Exibe indicadores agregados por ano",
    )

    args = parser.parse_args()

    plan = load_plan_from_json(args.config) if args.config else default_medical_plan()
    result = plan.simulate(args.years)

    print(result.format_summary())

    if args.show_yearly:
        print("\n=== Evolução anual ===")
        for totals in result.yearly_totals():
            print(
                f"Ano {totals['year']}: renda {_format_currency(totals['income'])}, "
                f"despesas {_format_currency(totals['expenses'])}, "
                f"investimentos {_format_currency(totals['ending_investment_balance'])}, "
                f"dívidas {_format_currency(totals['ending_debt_balance'])}"
            )


if __name__ == "__main__":
    run_cli()
