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
