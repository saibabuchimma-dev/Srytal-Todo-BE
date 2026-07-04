import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "SRYTAL Employee Task API",
      version: "1.0.0",
      description: "Backend APIs for Employee, Task and Project Management",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local Development",
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
          required: ["fullName", "email"],
          properties: {
            fullName: {
              type: "string",
              example: "John Doe",
            },

            email: {
              type: "string",
              example: "john@srytal.com",
            },

            role: {
              type: "string",
              enum: ["Admin", "Employee"],
              example: "Employee",
            },

            avatar: {
              type: "string",
              example: "",
            },

            isActive: {
              type: "boolean",
              example: true,
            },
          },
        },

        UpdateEmployee: {
          type: "object",
          properties: {
            fullName: {
              type: "string",
              example: "John Smith",
            },

            email: {
              type: "string",
              example: "john@srytal.com",
            },

            role: {
              type: "string",
              enum: ["Admin", "Employee"],
              example: "Employee",
            },

            avatar: {
              type: "string",
              example: "",
            },

            isActive: {
              type: "boolean",
              example: true,
            },
          },
        },

        EmployeeResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Employee created successfully",
            },

            data: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                },

                fullName: {
                  type: "string",
                },

                email: {
                  type: "string",
                },

                role: {
                  type: "string",
                },

                avatar: {
                  type: "string",
                },

                isActive: {
                  type: "boolean",
                },

                mustChangePassword: {
                  type: "boolean",
                  example: true,
                },

                createdAt: {
                  type: "string",
                  format: "date-time",
                },

                updatedAt: {
                  type: "string",
                  format: "date-time",
                },
              },
            },

            credentials: {
              type: "object",
              properties: {
                tempPassword: {
                  type: "string",
                  example: "Abc123Xyz",
                },
              },
            },
          },
        },

        EmployeeListResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            count: {
              type: "integer",
              example: 10,
            },

            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/EmployeeResponse",
              },
            },
          },
        },

        CreateTask: {
          type: "object",
          required: ["title", "dueDate"],
          properties: {
            assignedTo: {
              type: "string",
              nullable: true,
              example: "686523c5b65cde66f9831d18",
            },

            title: {
              type: "string",
              example: "Design Login UI",
            },

            description: {
              type: "string",
              example: "Create responsive login page",
            },

            status: {
              type: "string",
              enum: ["Pending", "In Progress", "Completed"],
              example: "Pending",
            },

            priority: {
              type: "string",
              enum: ["Low", "Medium", "High"],
              example: "High",
            },

            dueDate: {
              type: "string",
              format: "date",
              example: "2026-07-15",
            },
          },
        },

        UpdateTaskStatus: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["Pending", "In Progress", "Completed"],
              example: "Completed",
            },
          },
        },

        CreateProject: {
          type: "object",
          required: ["name", "startDate", "endDate"],
          properties: {
            name: {
              type: "string",
              example: "Employee Task Management",
            },

            description: {
              type: "string",
              example: "Backend API Development",
            },

            status: {
              type: "string",
              enum: ["Planning", "Active", "Completed", "On Hold"],
              example: "Planning",
            },

            startDate: {
              type: "string",
              format: "date",
              example: "2026-07-10",
            },

            endDate: {
              type: "string",
              format: "date",
              example: "2026-08-30",
            },

            members: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["686523c5b65cde66f9831d18", "686523c5b65cde66f9831d25"],
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
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "SRYTAL API Documentation",
    }),
  );
}
