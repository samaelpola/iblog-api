import { Sequelize, DataTypes } from "sequelize";
import { appConfig } from "../config/index.js";

const sequelize = new Sequelize({
  ...appConfig.getDatabaseConfig(),
  benchmark: true,
  logQueryParameters: true,
  logging:
    appConfig.APP_ENV === "development"
      ? (query, time) => {
          console.debug(`${time}ms: ${query}\n`);
        }
      : false,
});

export { sequelize, DataTypes };
