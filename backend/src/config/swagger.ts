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
