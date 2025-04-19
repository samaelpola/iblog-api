import { getArticle } from "../services/index.js";
import { StatusCodes } from "http-status-codes";

export const checkArticleExist = async (req, res, next) => {
  const { articleId } = req.params;
  const article = await getArticle(articleId);

  if (!article) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `article '${articleId}' not found` });
    return;
  }

  req.article = article;
  next();
};
