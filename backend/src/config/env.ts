import 'dotenv/config';

type Env = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  LOG_LEVEL: 'debug' | 'info';
  CORS_ALLOWED_ORIGINS: string[];
};

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseStringList(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const nodeEnv = (process.env.NODE_ENV as Env['NODE_ENV']) ?? 'development';

export const env: Env = {
  NODE_ENV: nodeEnv,
  PORT: parseNumber(process.env.PORT, 3000),
  LOG_LEVEL: (process.env.LOG_LEVEL as Env['LOG_LEVEL']) ?? 'info',
  CORS_ALLOWED_ORIGINS: parseStringList(process.env.CORS_ALLOWED_ORIGINS, [
    'http://localhost:3000',
    'http://localhost:5173',
  ]),
};
