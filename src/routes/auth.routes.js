import express from "express";
import jwt from "jsonwebtoken";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { appConfig } from "../config/index.js";
import { verifyCredentials, JwtService } from "../services/index.js";
import { authMiddleware } from "../middlewares/index.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Managing authentication
 */
const authRouter = express.Router();
const jwtService = new JwtService();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate user and return access token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessTokenResponse'
 *       403:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/login", async (req, res) => {
  const user = await verifyCredentials({ ...req.body });

  if (!user) {
    res.status(StatusCodes.FORBIDDEN).send({
      detail: "Invalid credentials",
    });
    return;
  }

  const payload = jwtService.getPayload(user);
  const accessToken = jwtService.generateAccessToken(payload);
  const refreshToken = jwtService.generateRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: appConfig.APP_USE_SSL,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ accessToken: accessToken });
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh the access token using the refresh token cookie
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessTokenResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ detail: "Refresh Token Cookie not found" });
    return;
  }

  try {
    const newAccessToken = jwtService.refreshAccessToken(refreshToken);
    res.json({ accessToken: newAccessToken });
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
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user and clear the refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
authRouter.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: appConfig.APP_USE_SSL,
    sameSite: "strict",
  });

  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/me", authMiddleware, (req, res) => {
  res.json(req.currentUser);
});

export { authRouter };
