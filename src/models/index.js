import { sequelize } from "../database/postgres.database.js";
import { User } from "./user.model.js";
import { Article } from "./article.model.js";
import { Category } from "./category.model.js";

const loadModels = async () => {
  User.hasMany(Article, { foreignKey: "authorId", as: "articles" });
  Article.belongsTo(User, { foreignKey: "authorId", as: "author" });
  Category.hasMany(Article);
  Article.belongsTo(Category);

  await sequelize.sync({ alter: true });
};

export { loadModels, Category, User, Article };
