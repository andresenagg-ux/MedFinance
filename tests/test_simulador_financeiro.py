import unittest

from simulador_financeiro import (
    Expense,
    FinancialPlan,
    IncomeSource,
    InvestmentPlan,
)


class FinancialPlanTestCase(unittest.TestCase):
    def test_reserve_is_built_before_investing(self) -> None:
        plan = FinancialPlan(
            incomes=[IncomeSource(name="Salário hospital", monthly_amount=10000)],
            expenses=[Expense(name="Custos fixos", monthly_amount=4000)],
            investment_plan=InvestmentPlan(
                name="Renda fixa",
                monthly_contribution=2000,
                expected_return=0.06,
                initial_balance=10000,
            ),
            emergency_reserve_months=6,
            debt_interest=0.12,
        )
        result = plan.simulate(years=1)

        last_month = result.months[-1]
        self.assertAlmostEqual(last_month["emergency_fund"], 24000.0)
        self.assertAlmostEqual(result.total_contributed, 16000.0)
        self.assertGreater(last_month["investment_balance"], 26000.0)

    def test_debt_grows_when_cash_is_negative(self) -> None:
        plan = FinancialPlan(
            incomes=[IncomeSource(name="Residência", monthly_amount=4000)],
            expenses=[Expense(name="Custo de vida", monthly_amount=8000)],
            investment_plan=None,
            emergency_reserve_months=3,
            debt_interest=0.24,
            initial_debt=5000,
        )
        result = plan.simulate(years=1)

        last_month = result.months[-1]
        self.assertGreater(last_month["debt_balance"], 5000)
        self.assertEqual(last_month["investment_balance"], 0.0)
        self.assertLess(result.total_income, result.total_expenses)

    def test_summary_contains_key_metrics(self) -> None:
        plan = FinancialPlan(
            incomes=[IncomeSource(name="Consultas", monthly_amount=15000)],
            expenses=[Expense(name="Estrutura", monthly_amount=8000)],
            investment_plan=InvestmentPlan(
                name="Multimercado",
                monthly_contribution=3000,
                expected_return=0.08,
                initial_balance=5000,
            ),
            emergency_reserve_months=4,
        )
        summary = plan.simulate(years=2).format_summary()

        self.assertIn("Resumo do Plano Financeiro", summary)
        self.assertIn("Total recebido", summary)
        self.assertIn("Reserva de emergência", summary)


if __name__ == "__main__":
    unittest.main()
