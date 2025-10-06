import { env } from './env';

export const swaggerDocument = {
  openapi: '3.1.0',
  info: {
    title: 'MedFinance API',
    description:
      'API documentation for MedFinance platform, providing access to user management and platform health status.',
    version: '1.0.0',
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Local development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Endpoints used to verify the API status.',
    },
    {
      name: 'Users',
      description: 'Endpoints that manage or retrieve user information.',
    },
    {
      name: 'Investments',
      description: 'Endpoints that provide investment-related information.',
    },
  ],
  paths: {
    '/healthcheck': {
      get: {
        tags: ['Health'],
        summary: 'Checks the API health status.',
        description: 'Returns the current availability status of the MedFinance API.',
        responses: {
          '200': {
            description: 'Successful response indicating that the API is reachable.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      description: "The API's status.",
                      example: 'ok',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Lists demo users.',
        description: 'Retrieves the list of example users available in the MedFinance platform.',
        responses: {
          '200': {
            description: 'A list of demo users.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['users'],
                  properties: {
                    users: {
                      type: 'array',
                      description: 'Collection of users registered in the platform.',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/investments/cdi': {
      get: {
        tags: ['Investments'],
        summary: 'Retrieves the latest CDI rate.',
        description:
          'Fetches the most recent CDI (Certificado de Depósito Interbancário) annual rate published by the Banco Central do Brasil and, optionally, estimates the profit of an investment held for one year.',
        parameters: [
          {
            in: 'query',
            name: 'amount',
            description: 'Investment amount in BRL used to project the profit after one year at the current CDI rate.',
            required: false,
            schema: {
              type: 'number',
              example: 10000,
              minimum: 0,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Latest CDI rate and optional investment projection.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['date', 'annualRate'],
                  properties: {
                    date: {
                      type: 'string',
                      format: 'date',
                      description: 'Date of the CDI rate informed by Banco Central do Brasil.',
                      example: '2025-10-03',
                    },
                    annualRate: {
                      type: 'number',
                      description: 'Annual CDI rate percentage.',
                      example: 13.65,
                    },
                    investmentProjection: {
                      type: 'object',
                      description: 'Projection for an investment kept for one year using the CDI rate.',
                      required: ['principal', 'profitAfterOneYear', 'finalAmountAfterOneYear'],
                      properties: {
                        principal: {
                          type: 'number',
                          description: 'Amount invested in BRL.',
                          example: 10000,
                        },
                        profitAfterOneYear: {
                          type: 'number',
                          description: 'Estimated profit after one year in BRL.',
                          example: 1365,
                        },
                        finalAmountAfterOneYear: {
                          type: 'number',
                          description: 'Projected total amount after one year in BRL.',
                          example: 11365,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error for the provided query parameters.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'The "amount" query parameter must be a positive number.',
                    },
                  },
                },
              },
            },
          },
          '502': {
            description: 'Error returned when the API cannot communicate with Banco Central do Brasil.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Unable to retrieve CDI rate from Banco Central do Brasil.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'role'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier of the user.',
            example: '1',
          },
          name: {
            type: 'string',
            description: "User's full name.",
            example: 'Dra. Ana Souza',
          },
          email: {
            type: 'string',
            format: 'email',
            description: "User's email address.",
            example: 'ana.souza@example.com',
          },
          role: {
            type: 'string',
            description: "User's role inside the platform.",
            enum: ['admin', 'student'],
            example: 'admin',
          },
        },
      },
    },
  },
} as const;
