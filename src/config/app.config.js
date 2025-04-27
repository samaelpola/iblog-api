import "dotenv/config";
import path from "node:path";

const allowedOrigins =
  process.env.CORS_ALLOW_ORIGINS?.split(",").map((o) => o.trim()) ?? [];

export const appConfig = {
  APP_ENV: process.env.NODE_ENV,
  APP_DIR: path.resolve(process.cwd()),
  APP_DIR_IMG_PATH: path.resolve(process.cwd(), "images", "articles"),
  APP_DIR_IMG_TMP_PATH: path.resolve(process.cwd(), "images", "tmp"),
  APP_PORT: parseInt(process.env.APP_PORT ?? "3000"),
  APP_USE_SSL: process.env.APP_USE_SSL === "true",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  corsOptions: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  },
  getDatabaseConfig: () => ({
    dialect: "postgres",
    database: process.env.POSTGRES_DB ?? "mydb",
    username: process.env.POSTGRES_USER ?? "admin",
    password: process.env.POSTGRES_PASSWORD ?? "admin",
    host: process.env.POSTGRES_HOST ?? "127.0.0.1",
    port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
  }),
};
