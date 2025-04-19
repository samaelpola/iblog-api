import { getCategory } from "../services/index.js";
import { StatusCodes } from "http-status-codes";

const checkCategoryExist = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await getCategory(categoryId);

  if (!category) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `category '${categoryId}' not found` });
  }

  req.category = category;
  next();
};

export { checkCategoryExist };
