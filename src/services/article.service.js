import { Article } from "../models/index.js";
import path from "node:path";
import fs from "node:fs";
import { appConfig } from "../config/index.js";

const checkTitleAlreadyExist = async (articleTittle) => {
  const article = await Article.findOne({
    where: {
      title: articleTittle,
    },
  });

  return article !== null;
};

const getArticles = async (limit = null, authorId = null) => {
  return await Article.findAll({
    order: [["createdAt", "DESC"]],
    ...(limit && { limit }),
    where: authorId ? { authorId } : undefined,
    include: { all: true },
  });
};

const getArticle = async (articleId) => {
  return await Article.findByPk(articleId, { include: { all: true } });
};

const createArticle = async (article, category, author) => {
  const newArticle = await Article.create({
    title: article.title,
    description: article.description,
    shortDescription: article.shortDescription,
    photo: article.photo,
  });
  newArticle.setAuthor(author);
  newArticle.setCategory(category);
  await newArticle.save();

  return newArticle;
};

const deleteArticle = async (article) => {
  const filePath = path.join(appConfig.APP_DIR, article.photo);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await article.destroy();
};

const updateArticleImg = async (article, file) => {
  const extension = path.extname(file.originalname);

  const newFileName = `${article.id}${extension}`;
  const newFilePath = path.join(appConfig.APP_DIR_IMG_PATH, newFileName);

  fs.renameSync(file.path, newFilePath);
  article.photo = `images/articles/${newFileName}`;
  await article.save();
};

const updateArticle = async (article, data, category) => {
  if (Object.prototype.hasOwnProperty.call(data, "title")) {
    article.title = data.title;
  }

  if (Object.prototype.hasOwnProperty.call(data, "description")) {
    article.description = data.description;
  }

  if (Object.prototype.hasOwnProperty.call(data, "shortDescription")) {
    article.shortDescription = data.shortDescription;
  }

  if (Object.prototype.hasOwnProperty.call(data, "categoryId")) {
    article.setCategory(category);
  }

  await article.save();
  await article.reload();
  return article;
};

export {
  checkTitleAlreadyExist,
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  updateArticle,
  updateArticleImg,
};
