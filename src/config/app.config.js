import "dotenv/config";
import path from "node:path";

export const appConfig = {
  APP_ENV: process.env.NODE_ENV,
  APP_DIR_IMG_PATH: path.resolve(process.cwd(), "images", "articles"),
  APP_DIR_IMG_TMP_PATH: path.resolve(process.cwd(), "images", "tmp"),
  APP_PORT: parseInt(process.env.APP_PORT ?? "3000"),
  APP_USE_SSL: process.env.APP_USE_SSL === "true",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  getDatabaseConfig: () => ({
    dialect: "postgres",
    database: process.env.POSTGRES_DB ?? "mydb",
    username: process.env.POSTGRES_USER ?? "admin",
    password: process.env.POSTGRES_PASSWORD ?? "admin",
    host: process.env.POSTGRES_HOST ?? "127.0.0.1",
    port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
  }),
};
