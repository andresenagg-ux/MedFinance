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
    {
      name: 'Videos',
      description: 'Endpoints responsible for managing educational video content.',
    },
    {
      name: 'Finance',
      description: 'Endpoints that provide financial planning simulations.',
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
    '/investments/cdi/realtime': {
      get: {
        tags: ['Investments'],
        summary: 'Calculates the real-time CDI rate at 100% of the benchmark.',
        description:
          'Retrieves the most recent CDI data directly from Banco Central do Brasil and calculates the real-time accrual for 100% of the CDI considering the current São Paulo time.',
        parameters: [
          {
            in: 'query',
            name: 'amount',
            description: 'Optional amount in BRL used to project the accrued profit in real time.',
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
            description: 'Real-time CDI metrics and optional investment accrual.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: [
                    'asOf',
                    'localDateTime',
                    'timeZone',
                    'date',
                    'cdiPercentage',
                    'annualRate',
                    'dailyRate',
                    'dailyFactor',
                    'accruedRate',
                    'accruedFactor',
                    'perSecondRate',
                    'perSecondFactor',
                    'elapsedBusinessSeconds',
                    'secondsInBusinessDay',
                  ],
                  properties: {
                    asOf: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Timestamp in UTC when the real-time rate was computed.',
                    },
                    localDateTime: {
                      type: 'string',
                      description: 'Local São Paulo date-time used for the accrual.',
                      example: '2025-10-03T14:32:05',
                    },
                    timeZone: {
                      type: 'string',
                      description: 'Time zone reference for the local date-time.',
                      example: 'America/Sao_Paulo',
                    },
                    date: {
                      type: 'string',
                      format: 'date',
                      description: 'Reference date of the CDI rate.',
                      example: '2025-10-03',
                    },
                    cdiPercentage: {
                      type: 'number',
                      description: 'Percentage of the CDI benchmark applied in the calculation.',
                      example: 100,
                    },
                    annualRate: {
                      type: 'number',
                      description: 'Annual CDI rate informed by Banco Central do Brasil.',
                      example: 13.65,
                    },
                    dailyRate: {
                      type: 'number',
                      description: 'Effective CDI rate for one business day.',
                      example: 0.5,
                    },
                    dailyFactor: {
                      type: 'number',
                      description: 'Growth factor equivalent to the daily CDI rate.',
                      example: 1.005,
                    },
                    accruedRate: {
                      type: 'number',
                      description: 'Accumulated CDI percentage since the start of the business day.',
                      example: 0.21,
                    },
                    accruedFactor: {
                      type: 'number',
                      description: 'Growth factor accumulated since the start of the business day.',
                      example: 1.0021,
                    },
                    perSecondRate: {
                      type: 'number',
                      description: 'Effective CDI rate per second.',
                      example: 0.000006,
                    },
                    perSecondFactor: {
                      type: 'number',
                      description: 'Growth factor equivalent to one elapsed second.',
                      example: 1.00000006,
                    },
                    elapsedBusinessSeconds: {
                      type: 'integer',
                      description: 'Number of seconds elapsed in the current business day in São Paulo.',
                      example: 45000,
                    },
                    secondsInBusinessDay: {
                      type: 'integer',
                      description: 'Total number of seconds considered for a business day (24 hours).',
                      example: 86400,
                    },
                    investmentProjection: {
                      type: 'object',
                      description: 'Real-time projection for the provided investment amount.',
                      required: ['principal', 'accruedProfit', 'finalAmount', 'factorApplied'],
                      properties: {
                        principal: {
                          type: 'number',
                          description: 'Amount invested in BRL.',
                          example: 10000,
                        },
                        accruedProfit: {
                          type: 'number',
                          description: 'Profit accrued so far in BRL.',
                          example: 21.45,
                        },
                        finalAmount: {
                          type: 'number',
                          description: 'Current total value considering the accrued CDI.',
                          example: 10021.45,
                        },
                        factorApplied: {
                          type: 'number',
                          description: 'Growth factor applied to the principal to obtain the final amount.',
                          example: 1.002145,
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
    '/finance/simulator': {
      post: {
        tags: ['Finance'],
        summary: 'Calculates a financial distribution and savings projection.',
        description:
          'Receives income and expense information to estimate the 50/30/20 distribution, savings outlook and potential investment return.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['monthlyIncome'],
                properties: {
                  monthlyIncome: {
                    type: 'number',
                    minimum: 0,
                    example: 18000,
                    description: 'Gross monthly income informed by the professional.',
                  },
                  fixedExpenses: {
                    type: 'number',
                    minimum: 0,
                    example: 8000,
                    description: 'Sum of fixed monthly expenses such as rent, payroll and software.',
                  },
                  variableExpenses: {
                    type: 'number',
                    minimum: 0,
                    example: 2500,
                    description: 'Total of variable or discretionary expenses, for example marketing and events.',
                  },
                  monthlyExpenses: {
                    type: 'number',
                    minimum: 0,
                    example: 10500,
                    description: 'Optional consolidated value for monthly expenses when the breakdown is unavailable.',
                  },
                  investmentRate: {
                    type: 'number',
                    minimum: 0,
                    example: 0.1,
                    description: 'Annual investment return rate expressed as a decimal (0.1 = 10%).',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Simulation calculated successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['finalBalance', 'monthlySavings', 'annualSavings', 'investmentReturn', 'distribution'],
                  properties: {
                    finalBalance: {
                      type: 'number',
                      example: 5500,
                      description: 'Net balance after subtracting the provided expenses from the income.',
                    },
                    monthlySavings: {
                      type: 'number',
                      example: 5500,
                      description: 'Amount available to save every month after the expenses.',
                    },
                    annualSavings: {
                      type: 'number',
                      example: 66000,
                      description: 'Projected savings accumulated after 12 months.',
                    },
                    investmentReturn: {
                      type: 'number',
                      example: 6600,
                      description: 'Estimated return applying the informed investment rate over the annual savings.',
                    },
                    distribution: {
                      type: 'object',
                      description: 'Recommended 50/30/20 distribution for the monthly income.',
                      required: ['needs', 'wants', 'savings'],
                      properties: {
                        needs: {
                          type: 'number',
                          example: 9000,
                        },
                        wants: {
                          type: 'number',
                          example: 5400,
                        },
                        savings: {
                          type: 'number',
                          example: 3600,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error for the provided payload.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'The "monthlyIncome" field must be a non-negative number.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/videos': {
      get: {
        tags: ['Videos'],
        summary: 'Lists all uploaded educational videos.',
        description:
          'Retrieves the catalog of educational videos available within the MedFinance learning platform.',
        responses: {
          '200': {
            description: 'Collection of uploaded videos.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['videos'],
                  properties: {
                    videos: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Video' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/videos/upload': {
      post: {
        tags: ['Videos'],
        summary: 'Uploads a new educational video.',
        description:
          'Allows administrators to upload new video lessons. The request must be authenticated using the "x-user-id" header.',
        parameters: [
          {
            in: 'header',
            name: 'x-user-id',
            description: 'Identifier of the authenticated user performing the operation.',
            required: true,
            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VideoUploadInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Video uploaded successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['video'],
                  properties: {
                    video: {
                      $ref: '#/components/schemas/Video',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error for the provided payload.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'The "title" field is required.',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Missing authentication header.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'The "x-user-id" header is required to authenticate the request.',
                    },
                  },
                },
              },
            },
          },
          '403': {
            description: 'User is authenticated but does not have permission to upload videos.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Video upload is restricted to administrator profiles.',
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Authenticated user could not be found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User not found.',
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
        required: ['id', 'name', 'email', 'role', 'permissions'],
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
          permissions: {
            type: 'array',
            description: 'Capabilities granted to the user within the platform.',
            items: {
              type: 'string',
              enum: ['manage_videos', 'manage_courses', 'manage_users', 'view_courses'],
            },
            example: ['manage_videos', 'manage_courses', 'manage_users', 'view_courses'],
          },
        },
      },
      VideoUploadInput: {
        type: 'object',
        required: ['title', 'url'],
        properties: {
          title: {
            type: 'string',
            description: 'Title presented to students when browsing the catalog.',
            example: 'Introdução à gestão financeira para clínicas médicas',
          },
          description: {
            type: 'string',
            description: 'Optional description outlining the main topics covered in the video.',
            example: 'Guia completo para montar indicadores e projeções de fluxo de caixa.',
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'URL pointing to the hosted video asset.',
            example: 'https://cdn.medfinance.com/videos/gestao-financeira.mp4',
          },
        },
      },
      Video: {
        type: 'object',
        required: ['id', 'title', 'url', 'uploadedBy', 'uploadedAt'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier of the uploaded video.',
            example: '0f95ec88-0b3f-4677-b9df-3a6d3f640efd',
          },
          title: {
            type: 'string',
            description: 'Video title.',
            example: 'Introdução à gestão financeira para clínicas médicas',
          },
          description: {
            type: 'string',
            nullable: true,
            description: 'Optional description of the video content.',
            example: 'Guia completo para montar indicadores e projeções de fluxo de caixa.',
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'Location where the video is hosted.',
            example: 'https://cdn.medfinance.com/videos/gestao-financeira.mp4',
          },
          uploadedBy: {
            type: 'string',
            description: 'Identifier of the administrator who uploaded the video.',
            example: '1',
          },
          uploadedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp indicating when the video was uploaded.',
            example: '2024-04-03T18:02:15.000Z',
          },
        },
      },
    },
  },
} as const;
