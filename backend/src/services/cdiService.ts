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

class CdiService {
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
}

export const cdiService = new CdiService();
