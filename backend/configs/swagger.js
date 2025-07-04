const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Fitcify API',
      version: '1.0.0',
      description: 'API documentation for Fitcify backend (Spotify clone)',
    },
    servers: [
      {
        url: 'http://localhost:5000',  // ✅ Make sure this matches actual backend port
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken', // ✅ this must match your cookie name
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },

  apis: [
    path.join(__dirname, '..', 'routes', '**', '*.js'),         // inline route docs
    path.join(__dirname, '..', 'docs', '**', '*.swagger.js'),   // external docs
  ],
};

module.exports = swaggerJsdoc(options);