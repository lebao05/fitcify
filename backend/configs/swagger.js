// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fitcify API",
      version: "1.0.0",
      description: "API documentation for Fitcify",
    },
    servers: [
      {
        url: "http://localhost:3000", // Your base URL
      },
    ],
  },
  apis: ["./routes/*.js"], // 👈 Path to your API routes with Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;