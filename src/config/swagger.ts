import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SRYTAL Employee Task API",
      version: "1.0.0",
      description: "Backend APIs for Employee Task Management",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        CreateEmployee: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "phone",
            "designation",
            "department",
            "joiningDate",
          ],
          properties: {
            firstName: {
              type: "string",
              example: "Saibabu",
            },
            lastName: {
              type: "string",
              example: "Chimma",
            },
            email: {
              type: "string",
              example: "saibabu@srytal.com",
            },
            phone: {
              type: "string",
              example: "9876543210",
            },
            designation: {
              type: "string",
              example: "Frontend Developer",
            },
            department: {
              type: "string",
              example: "Engineering",
            },
            joiningDate: {
              type: "string",
              format: "date",
              example: "2026-07-02",
            },
            status: {
              type: "string",
              enum: ["Active", "Inactive"],
              example: "Active",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}