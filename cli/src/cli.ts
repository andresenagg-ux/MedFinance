import { Command, InvalidArgumentError } from 'commander';
import { buildSimulationSummary, calculateSimulation, SimulationInput, SimulationResult } from './simulation';

function parseNumber(value: string, field: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new InvalidArgumentError(`O valor informado para ${field} deve ser numérico.`);
  }

  return parsed;
}

function toSimulationInput(options: {
  monthlyIncome: number;
  monthlyExpenses: number;
  investmentRate: number;
}): SimulationInput {
  return {
    monthlyIncome: options.monthlyIncome,
    monthlyExpenses: options.monthlyExpenses,
    investmentRate: options.investmentRate,
  };
}

function renderJson(input: SimulationInput, result: SimulationResult): string {
  return JSON.stringify({
    input,
    result,
  }, null, 2);
}

function renderText(input: SimulationInput, result: SimulationResult): string {
  return `${buildSimulationSummary(input, result)}\n`;
}

export interface CliIO {
  stdout: NodeJS.WritableStream;
  stderr: NodeJS.WritableStream;
}

export function createProgram(io: CliIO = { stdout: process.stdout, stderr: process.stderr }) {
  const program = new Command();

  program
    .name('medfinance-simulator')
    .description('Simule metas financeiras diretamente pelo terminal.')
    .configureOutput({
      writeOut(str) {
        io.stdout.write(str);
      },
      writeErr(str) {
        io.stderr.write(str);
      },
    })
    .option('-j, --json', 'Exibir o resultado em formato JSON.');

  program.requiredOption('-i, --monthly-income <number>', 'Valor da renda mensal.', (value) => parseNumber(value, 'monthlyIncome'));
  program.requiredOption('-e, --monthly-expenses <number>', 'Total de despesas mensais.', (value) => parseNumber(value, 'monthlyExpenses'));
  program.requiredOption('-r, --investment-rate <number>', 'Taxa anual esperada de investimento (ex: 0.12 para 12%).', (value) => parseNumber(value, 'investmentRate'));

  program.action((options: { json?: boolean; monthlyIncome: number; monthlyExpenses: number; investmentRate: number }) => {
    const input = toSimulationInput(options);
    const result = calculateSimulation(input);
    const output = options.json ? renderJson(input, result) : renderText(input, result);
    io.stdout.write(output);
  });

  return program;
}

export async function runCli(argv: string[], io?: CliIO): Promise<number> {
  const streams = io ?? { stdout: process.stdout, stderr: process.stderr };
  const program = createProgram(streams);
  program.exitOverride();

  try {
    await program.parseAsync(argv, { from: 'user' });
    return 0;
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      streams.stderr.write(`${error.message}\n`);
      return 1;
    }

    if (error && typeof error === 'object' && 'exitCode' in error) {
      return (error as { exitCode?: number }).exitCode ?? 1;
    }

    streams.stderr.write(`${(error as Error).message}\n`);
    return 1;
  }
}
