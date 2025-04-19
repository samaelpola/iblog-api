import { sequelize, DataTypes } from "../database/postgres.database.js";

export const Category = sequelize.define("categories", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
