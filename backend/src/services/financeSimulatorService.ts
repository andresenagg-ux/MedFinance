export interface FinanceSimulationInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermMonths: number;
  extraPayment?: number;
}

export interface FinanceSimulationScheduleEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface FinanceSimulationResult {
  monthlyPayment: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  payoffMonths: number;
  schedule: FinanceSimulationScheduleEntry[];
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export class FinanceSimulatorService {
  simulate(input: FinanceSimulationInput): FinanceSimulationResult {
    const { loanAmount, annualInterestRate, loanTermMonths, extraPayment = 0 } = input;

    const monthlyRate = annualInterestRate === 0 ? 0 : annualInterestRate / 12 / 100;
    const baseMonthlyPayment =
      monthlyRate === 0
        ? loanAmount / loanTermMonths
        : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTermMonths));

    let balance = loanAmount;
    let month = 0;
    let totalInterestPaid = 0;
    const schedule: FinanceSimulationScheduleEntry[] = [];

    while (balance > 0 && month < loanTermMonths) {
      month += 1;
      const interestPayment = monthlyRate === 0 ? 0 : balance * monthlyRate;
      let principalPayment = baseMonthlyPayment - interestPayment;
      let payment = baseMonthlyPayment;

      if (extraPayment > 0) {
        payment += extraPayment;
        principalPayment += extraPayment;
      }

      if (principalPayment > balance) {
        principalPayment = balance;
        payment = interestPayment + balance;
      }

      const roundedInterest = roundCurrency(interestPayment);
      const roundedPrincipal = roundCurrency(principalPayment);
      const roundedPayment = roundCurrency(roundedInterest + roundedPrincipal);

      balance = roundCurrency(balance - roundedPrincipal);
      if (balance < 0) {
        balance = 0;
      }

      totalInterestPaid = roundCurrency(totalInterestPaid + roundedInterest);

      schedule.push({
        month,
        payment: roundedPayment,
        principal: roundedPrincipal,
        interest: roundedInterest,
        remainingBalance: balance,
      });

      if (balance === 0) {
        break;
      }
    }

    const totalAmountPaid = roundCurrency(
      schedule.reduce((sum, entry) => sum + entry.payment, 0),
    );

    return {
      monthlyPayment: roundCurrency(baseMonthlyPayment),
      totalInterestPaid,
      totalAmountPaid,
      payoffMonths: schedule.length,
      schedule,
    };
  }
}

export const financeSimulatorService = new FinanceSimulatorService();
