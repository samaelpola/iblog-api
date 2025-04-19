import { getUser } from "../services/index.js";
import { StatusCodes } from "http-status-codes";

export const checkUserExist = async (req, res, next) => {
  const { userId } = req.params;
  const user = await getUser(userId);

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `user '${userId}' not found` });
  }

  req.user = user;
  next();
};
