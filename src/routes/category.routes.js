import express from "express";
import { StatusCodes } from "http-status-codes";
import { checkSchema } from "express-validator";
import { subject as defineSubject } from "@casl/ability";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/index.js";
import {
  authMiddleware,
  checkCategoryExist,
  checkPermission,
} from "../middlewares/index.js";
import {
  categoryValidationRules,
  categoryPatchValidationRules,
} from "../schemas/index.js";
import { validateSchema } from "../schemas/index.js";

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Managing Categories
 */
const categoryRouter = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
categoryRouter.get("/", async (req, res) => {
  res.json(await getCategories());
});

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     tags: [Categories]
 *     summary: Get a category by ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
categoryRouter.get("/:categoryId", checkCategoryExist, (req, res) => {
  res.json(req.category);
});

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
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
categoryRouter.post(
  "/",
  authMiddleware,
  checkSchema(categoryValidationRules),
  validateSchema,
  checkPermission("create", () => "Category"),
  async (req, res) => {
    res.status(201).json(await createCategory(req.body));
  },
);

/**
 * @swagger
 * /categories/{categoryId}:
 *   patch:
 *     tags: [Categories]
 *     summary: Update a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
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
categoryRouter.patch(
  "/:categoryId",
  authMiddleware,
  checkSchema(categoryPatchValidationRules),
  validateSchema,
  checkCategoryExist,
  checkPermission("update", (req) => defineSubject("Category", req.category)),
  async (req, res) => {
    res.json(await updateCategory(req.category, req.body));
  },
);

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description Category deleted
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
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
categoryRouter.delete(
  "/:categoryId",
  authMiddleware,
  checkCategoryExist,
  checkPermission("delete", (req) => defineSubject("Category", req.category)),
  async (req, res) => {
    await deleteCategory(req.category);
    res.status(StatusCodes.NO_CONTENT);
  },
);

export { categoryRouter };
