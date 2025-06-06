import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV_VARS } from '../envVars.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wassit Freelance API',
      version: '1.0.0',
      description: 'API documentation for Wassit Freelance platform',
      contact: {
        name: 'Wassit Support',
        email: 'wassim.blilita19@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `www.wassitfreedz.com/api/v1`,
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    path.join(__dirname, '../../routes/*.js'),
    path.join(__dirname, '../../models/*.js')
  ]
};

export const specs = swaggerJsdoc(options); 