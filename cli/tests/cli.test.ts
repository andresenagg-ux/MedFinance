import { PassThrough } from 'stream';
import { runCli } from '../src/cli';

function createBuffer() {
  const stream = new PassThrough();
  let content = '';
  stream.on('data', (chunk) => {
    content += chunk.toString('utf-8');
  });

  return {
    stream,
    read(): string {
      return content;
    },
  };
}

describe('CLI', () => {
  it('prints a formatted summary when all parameters are provided', async () => {
    const stdout = createBuffer();
    const stderr = createBuffer();

    const exitCode = await runCli(
      ['-i', '12000', '-e', '7500', '-r', '0.1'],
      { stdout: stdout.stream, stderr: stderr.stream },
    );

    expect(exitCode).toBe(0);
    expect(stdout.read()).toContain('Resumo da simulação financeira');
    expect(stdout.read()).toContain('Poupança mensal:');
    expect(stderr.read()).toBe('');
  });

  it('supports JSON output', async () => {
    const stdout = createBuffer();
    const stderr = createBuffer();

    const exitCode = await runCli(
      ['-i', '8000', '-e', '3000', '-r', '0.2', '--json'],
      { stdout: stdout.stream, stderr: stderr.stream },
    );

    expect(exitCode).toBe(0);
    const output = stdout.read();
    const payload = JSON.parse(output);
    expect(payload.input.monthlyIncome).toBe(8000);
    expect(payload.result.monthlySavings).toBe(5000);
    expect(stderr.read()).toBe('');
  });

  it('returns a non-zero exit code when arguments are missing', async () => {
    const stdout = createBuffer();
    const stderr = createBuffer();

    const exitCode = await runCli(['-i', '5000'], { stdout: stdout.stream, stderr: stderr.stream });

    expect(exitCode).toBeGreaterThan(0);
    expect(stderr.read()).toContain('error: required option');
  });

  it('validates numeric values', async () => {
    const stdout = createBuffer();
    const stderr = createBuffer();

    const exitCode = await runCli(
      ['-i', 'abc', '-e', '1000', '-r', '0.1'],
      { stdout: stdout.stream, stderr: stderr.stream },
    );

    expect(exitCode).toBe(1);
    expect(stderr.read()).toContain('deve ser numérico');
    expect(stdout.read()).toBe('');
  });

  it('validates domain rules for the simulation', async () => {
    const stdout = createBuffer();
    const stderr = createBuffer();

    const exitCode = await runCli(
      ['-i', '5000', '-e', '-10', '-r', '0.1'],
      { stdout: stdout.stream, stderr: stderr.stream },
    );

    expect(exitCode).toBe(1);
    expect(stderr.read()).toContain('despesas mensais');
    expect(stdout.read()).toBe('');
  });
});
