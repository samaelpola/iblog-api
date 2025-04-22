import express from "express";
import { StatusCodes } from "http-status-codes";
import { checkSchema } from "express-validator";
import { subject as defineSubject } from "@casl/ability";
import { validateSchema } from "../schemas/index.js";
import {
  authMiddleware,
  authNoRequiredMiddleware,
  checkPermission,
  checkUserExist,
} from "../middlewares/index.js";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../services/index.js";
import {
  userValidationRules,
  userPatchValidationRules,
} from "../schemas/index.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Managing Users
 */
const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get(
  "/",
  authMiddleware,
  checkPermission("read", () => "all"),
  async (req, res) => {
    res.json(await getUsers());
  },
);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get(
  "/:userId",
  authMiddleware,
  checkUserExist,
  checkPermission("read", (req) => defineSubject("User", req.user)),
  (req, res) => {
    res.json(req.user);
  },
);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
userRouter.post(
  "/",
  checkSchema(userValidationRules),
  validateSchema,
  authNoRequiredMiddleware,
  checkPermission("create", (req) => defineSubject("User", req.body)),
  async (req, res) => {
    return res.status(StatusCodes.CREATED).json(await createUser(req.body));
  },
);

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
userRouter.patch(
  "/:userId",
  authMiddleware,
  checkSchema(userPatchValidationRules),
  validateSchema,
  checkUserExist,
  checkPermission(
    "update",
    (req) => defineSubject("User", req.user),
    (req) => Object.keys(req.body),
  ),
  async (req, res) => {
    return res.json(await updateUser(req.user, req.body));
  },
);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.delete(
  "/:userId",
  authMiddleware,
  checkUserExist,
  checkPermission("delete", (req) => defineSubject("User", req.user)),
  async (req, res) => {
    await deleteUser(req.user);
    res.status(StatusCodes.NO_CONTENT);
  },
);

export { userRouter };
