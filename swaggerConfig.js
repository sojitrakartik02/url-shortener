import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Advanced URL Shortener API",
    version: "1.0.0",
    description: "API documentation for the Advanced URL Shortener",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/routes/authRoutes.js",
    "./src/routes/urlRoutes.js",
    "./src/routes/analyticsRoutes.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default { swaggerUi, swaggerSpec };
