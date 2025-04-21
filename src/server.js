import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import * as fs from "node:fs";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import { authMiddleware } from "./middlewares/index.js";
import { appConfig, swaggerOptions } from "./config/index.js";
import {
  articleRouter,
  authRouter,
  categoryRouter,
  userRouter,
} from "./routes/index.js";

export const createApp = () => {
  const app = express();
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  fs.mkdirSync(appConfig.APP_DIR_IMG_PATH, { recursive: true });
  fs.mkdirSync(appConfig.APP_DIR_IMG_TMP_PATH, { recursive: true });

  app.use(
    morgan(
      ":remote-addr - :remote-user [:date[clf]] :method :url :status - :response-time ms ':user-agent'",
    ),
  );
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/images/articles", express.static(appConfig.APP_DIR_IMG_PATH));
  app.use("/auth", authRouter);
  app.use("/users", authMiddleware, userRouter);
  app.use("/articles", articleRouter);
  app.use("/categories", categoryRouter);

  return app;
};
