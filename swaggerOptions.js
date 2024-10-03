// swaggerOptions.js
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0', // or '2.0.0' for Swagger 2.0
      info: {
        title: 'Your API Title',
        version: '1.0.0',
        description: 'API documentation',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [], // Apply to all endpoints
        },
      ],
    },
    apis: ['./routes/*.js'], // Path to your API docs
  };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
