import { getUser } from "../services/index.js";
import { StatusCodes } from "http-status-codes";

export const checkUserExist = async (req, res, next) => {
  const { userId } = req.params;
  const user = await getUser(parseInt(userId));

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ detail: `user '${userId}' not found` });
  }

  req.user = user;
  next();
};
