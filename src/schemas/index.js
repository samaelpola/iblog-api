import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
export {
  articleValidationRules,
  articlePatchValidationRules,
} from "./article.schemas.js";
export {
  userValidationRules,
  userPatchValidationRules,
} from "./user.schemas.js";
export {
  categoryValidationRules,
  categoryPatchValidationRules,
} from "./category.schemas.js";

export const validateSchema = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array() });
  }

  next();
};
