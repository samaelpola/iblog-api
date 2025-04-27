import { sequelize, DataTypes } from "../database/postgres.database.js";
import { hashPassword } from "../services/index.js";
import { AppUserRole } from "../utils/index.js";

export const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("M", "F"),
      allowNull: false,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [AppUserRole.USER],
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (record, _) => {
        if (record.dataValues.password !== null) {
          record.dataValues.password = (
            await hashPassword(record.dataValues.password)
          ).toString();
        }
      },
      beforeUpdate: async (record, _) => {
        if (record.dataValues.password !== null) {
          record.dataValues.password = (
            await hashPassword(record.dataValues.password)
          ).toString();
        }
      },
    },
  },
);

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};
