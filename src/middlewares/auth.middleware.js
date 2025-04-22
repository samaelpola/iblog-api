import { getReasonPhrase, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { getUser, JwtService } from "../services/index.js";

export const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ detail: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
    return;
  }

  const tokenKeys = authorization.split(" ");
  if (tokenKeys[0] !== "Bearer") {
    res
      .sendStatus(StatusCodes.UNAUTHORIZED)
      .json({ detail: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
    return;
  }

  try {
    const jwtService = new JwtService();
    const payload = jwtService.verifyAccessToken(tokenKeys[1]);
    const user = await getUser(payload.id);
    if (!user) {
      res.sendStatus(StatusCodes.FORBIDDEN).json({
        error: `User '${payload.id}' not found`,
      });
      return;
    }

    req.currentUser = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(StatusCodes.FORBIDDEN).json({ detail: error.message });
      return;
    }

    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ detail: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
};
