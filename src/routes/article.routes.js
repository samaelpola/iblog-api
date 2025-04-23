import express from "express";
import { StatusCodes } from "http-status-codes";
import { checkSchema } from "express-validator";
import { subject as defineSubject } from "@casl/ability";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  updateArticleImg,
} from "../services/index.js";
import {
  authMiddleware,
  checkArticleExist,
  checkPermission,
  removeUploadedFileMiddleware,
  upload,
} from "../middlewares/index.js";
import {
  articleValidationRules,
  articlePatchValidationRules,
  validateSchema,
} from "../schemas/index.js";

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Managing articles and their images
 */
const articleRouter = express.Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
articleRouter.get("/", async (req, res) => {
  res.json(await getArticles());
});

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
articleRouter.get("/:articleId", checkArticleExist, (req, res) => {
  res.json(req.article);
});

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
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
articleRouter.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  removeUploadedFileMiddleware,
  checkSchema(articleValidationRules),
  validateSchema,
  checkPermission("create", () => "Article"),
  async (req, res) => {
    const article = await createArticle(
      req.body,
      req.category,
      req.currentUser,
    );

    if (req.file) {
      await updateArticleImg(article, req.file);
    }

    return res.status(StatusCodes.CREATED).json(article);
  },
);

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Article updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Article not found
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
articleRouter.patch(
  "/:articleId",
  authMiddleware,
  upload.single("photo"),
  removeUploadedFileMiddleware,
  checkSchema(articlePatchValidationRules),
  validateSchema,
  checkArticleExist,
  checkPermission(
    "update",
    (req) => defineSubject("Article", req.article),
    (req) => Object.keys(req.body),
  ),
  async (req, res) => {
    const article = await updateArticle(req.article, req.body, req.category);
    if (req.file) {
      await updateArticleImg(article, req.file);
    }
    return res.json(article);
  },
);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Article deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *        description: Forbidden
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
articleRouter.delete(
  "/:articleId",
  authMiddleware,
  checkArticleExist,
  checkPermission("delete", (req) => defineSubject("Article", req.article)),
  async (req, res) => {
    await deleteArticle(req.article);
    res.status(StatusCodes.NO_CONTENT);
  },
);

/**
 * @swagger
 * /images/articles/{filename}:
 *   get:
 *     summary: Get uploaded article image
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Filename of the uploaded image
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */

export { articleRouter };
