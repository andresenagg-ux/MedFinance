import https from 'https';

export interface CdiQuote {
  /**
   * Date of the CDI rate in ISO-8601 format (YYYY-MM-DD).
   */
  date: string;
  /**
   * Annual CDI rate expressed as a percentage (e.g., 13.65 for 13.65%).
   */
  rate: number;
}

export interface RealTimeCdiQuote {
  /** Timestamp (UTC) when the real-time rate calculation was produced. */
  asOf: string;
  /** ISO-8601 local date-time in São Paulo that was used for the calculation. */
  localDateTime: string;
  /** Time zone reference for the local date-time. */
  timeZone: string;
  /** Date of the CDI rate provided by Banco Central do Brasil. */
  date: string;
  /** CDI percentage reference (100% for this API). */
  cdiPercentage: number;
  /** Annual CDI rate expressed as a percentage. */
  annualRate: number;
  /** Effective CDI rate for a single business day (%). */
  dailyRate: number;
  /** Effective CDI growth factor for a single business day. */
  dailyFactor: number;
  /** CDI rate accrued since the beginning of the local business day (%). */
  accruedRate: number;
  /** CDI growth factor accrued since the beginning of the local business day. */
  accruedFactor: number;
  /** CDI rate per second in percentage terms. */
  perSecondRate: number;
  /** CDI growth factor for one elapsed second. */
  perSecondFactor: number;
  /** Seconds elapsed in the current local business day. */
  elapsedBusinessSeconds: number;
  /** Total number of seconds considered for a business day. */
  secondsInBusinessDay: number;
}

class CdiService {
  private static readonly BUSINESS_DAYS_PER_YEAR = 252;
  private static readonly SECONDS_IN_BUSINESS_DAY = 24 * 60 * 60;
  private static readonly TIME_ZONE = 'America/Sao_Paulo';

  private readonly endpoint =
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json';

  async getLatestRate(): Promise<CdiQuote> {
    const response = await this.fetchBancoCentralData<{ data: string; valor: string }[]>(this.endpoint);

    if (!Array.isArray(response) || response.length === 0) {
      throw new Error('Banco Central do Brasil returned an empty response for the CDI rate.');
    }

    const [latest] = response;
    const rate = Number(latest.valor.replace(',', '.'));

    if (Number.isNaN(rate)) {
      throw new Error('Banco Central do Brasil returned an invalid CDI rate.');
    }

    const [day, month, year] = latest.data.split('/');

    if (!day || !month || !year) {
      throw new Error('Banco Central do Brasil returned an invalid date for the CDI rate.');
    }

    const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    return { date, rate };
  }

  async getRealTimeRate(referenceDate = new Date()): Promise<RealTimeCdiQuote> {
    const { date, rate } = await this.getLatestRate();

    const { secondsElapsed, localDateTime } = this.getBrazilTime(referenceDate);

    const annualFactor = 1 + rate / 100;
    const dailyFactor = Math.pow(annualFactor, 1 / CdiService.BUSINESS_DAYS_PER_YEAR);
    const perSecondFactor = Math.pow(
      annualFactor,
      1 / (CdiService.BUSINESS_DAYS_PER_YEAR * CdiService.SECONDS_IN_BUSINESS_DAY),
    );
    const accruedFactor = Math.pow(
      annualFactor,
      secondsElapsed / (CdiService.BUSINESS_DAYS_PER_YEAR * CdiService.SECONDS_IN_BUSINESS_DAY),
    );

    return {
      asOf: referenceDate.toISOString(),
      localDateTime,
      timeZone: CdiService.TIME_ZONE,
      date,
      cdiPercentage: 100,
      annualRate: rate,
      dailyRate: this.round((dailyFactor - 1) * 100, 6),
      dailyFactor: this.round(dailyFactor, 12),
      accruedRate: this.round((accruedFactor - 1) * 100, 6),
      accruedFactor: this.round(accruedFactor, 12),
      perSecondRate: this.round((perSecondFactor - 1) * 100, 10),
      perSecondFactor: this.round(perSecondFactor, 14),
      elapsedBusinessSeconds: secondsElapsed,
      secondsInBusinessDay: CdiService.SECONDS_IN_BUSINESS_DAY,
    };
  }

  private fetchBancoCentralData<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          const { statusCode } = res;

          if (!statusCode || statusCode < 200 || statusCode >= 300) {
            res.resume();
            reject(new Error(`Failed to fetch CDI rate from Banco Central do Brasil (status ${statusCode ?? 'unknown'}).`));
            return;
          }

          let rawData = '';
          res.setEncoding('utf8');

          res.on('data', (chunk) => {
            rawData += chunk;
          });

          res.on('end', () => {
            try {
              const parsed = JSON.parse(rawData) as T;
              resolve(parsed);
            } catch (error) {
              reject(new Error('Failed to parse response from Banco Central do Brasil.'));
            }
          });
        })
        .on('error', (error) => {
          reject(new Error(`Unable to connect to Banco Central do Brasil: ${(error as Error).message}`));
        });
    });
  }

  private getBrazilTime(reference: Date): { secondsElapsed: number; localDateTime: string } {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: CdiService.TIME_ZONE,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const parts = formatter.formatToParts(reference);
    const values: Record<string, string> = {};

    for (const part of parts) {
      if (part.type !== 'literal') {
        values[part.type] = part.value;
      }
    }

    const year = values.year ?? '0000';
    const month = values.month ?? '01';
    const day = values.day ?? '01';
    const hour = Number.parseInt(values.hour ?? '0', 10);
    const minute = Number.parseInt(values.minute ?? '0', 10);
    const second = Number.parseInt(values.second ?? '0', 10);

    const secondsElapsed = Math.min(
      Math.max(hour * 3600 + minute * 60 + second, 0),
      CdiService.SECONDS_IN_BUSINESS_DAY,
    );

    const localDateTime = `${year}-${month}-${day}T${values.hour ?? '00'}:${values.minute ?? '00'}:${values.second ?? '00'}`;

    return { secondsElapsed, localDateTime };
  }

  private round(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }
}

export const cdiService = new CdiService();
