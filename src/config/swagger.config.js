export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IBLOG API",
      version: "1.0.0",
      description: "REST API for managing articles",
    },
    servers: [
      {
        url: "http://localhost:3000",
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
        Article: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "My First Article" },
            description: { type: "string", example: "Full content..." },
            shortDescription: { type: "string", example: "Short summary" },
            photo: { type: "string", example: "uploads/articles/1.jpg" },
            categoryId: { type: "integer", example: 2 },
            authorId: { type: "integer", example: 4 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ArticleInput: {
          type: "object",
          required: ["title", "description", "shortDescription", "categoryId"],
          properties: {
            title: { type: "string", example: "My First Article" },
            description: { type: "string", example: "Full content..." },
            shortDescription: { type: "string", example: "Short summary" },
            photo: { type: "string", example: "uploads/articles/1.jpg" },
            categoryId: { type: "integer", example: 2 },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "My First Category" },
            key: { type: "string", example: "My First Category" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CategoryInput: {
          type: "object",
          required: ["name", "key"],
          properties: {
            name: { type: "string", example: "My First Category" },
            key: { type: "string", example: "My First Category" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            lastName: { type: "string", example: "john" },
            firstName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            gender: { type: "enum", value: ["M", "F"], example: "M" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserInput: {
          type: "object",
          required: ["lastName", "password", "email", "gender"],
          properties: {
            lastName: { type: "string", example: "john" },
            firstName: { type: "string", example: "Doe" },
            password: { type: "string", example: "password" },
            email: { type: "string", example: "john.doe@example.com" },
            gender: { type: "enum", value: ["M", "F"], example: "M" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "secret123" },
          },
        },
        AccessTokenResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "eyJhbGciOi..." },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            detail: { type: "string", example: "Error" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  msg: { type: "string", example: "Name is required" },
                  param: { type: "string", example: "name" },
                  location: { type: "string", example: "body" },
                },
              },
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
  apis: ["./src/routes/*.js"],
};
