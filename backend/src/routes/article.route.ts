import express, { Router } from 'express';
import { articleController, articleValidation } from '../modules/articles';
import { validate } from '../modules/validate';
import singleUpload from '../modules/media/multer';
import { auth } from '../modules/auth';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), singleUpload, validate(articleValidation.createArticle), articleController.createArticle)
  .get(auth(), validate(articleValidation.getArticles), articleController.getArticles);

router
  .route('/:articleId')
  .get(auth(), validate(articleValidation.getArticle), articleController.getArticle)
  .delete(auth(), singleUpload, validate(articleValidation.deleteArticle), articleController.deleteArticle)
  .put(auth(), singleUpload, validate(articleValidation.updateArticle), articleController.updateArticle)
  .patch(auth(), validate(articleValidation.likeArticle), articleController.likeArticle);
// .post(validate(articleValidation.createArticleComments), articleController.createArticleComments);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Create an article 
 */

/**
 * @swagger
 * /article:
 *   post:
 *     summary: Create an article
 *     description: Only users with a verified account  can create an article or a post.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - article
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               article:
 *                 type: string
 *               image:
 *                 type: string
 *             example:
 *               title: Fake article title
 *               article: This is a fake article
 *               image.: example.png
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all posts/articles
 *     description: Only registered users and admin can retrieve all posts/aricles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Article or post title name
 *       - in: query
 *         name: article
 *         schema:
 *           type: string
 *         description: Aricle or post body
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /article/{id}:
 *   get:
 *     summary: Get a post/article
 *     description: Logged in users can fetch all articles. 
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 * 
 *   delete:
 *     summary: Delete an article/post
 *     description: Logged in users can delete only their posts. Only admins can delete other users article/posts.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update an article/post
 *     description: Logged in users can only update their own information. Only admins can update other user's posts/article.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               article:
 *                 type: string
 *               image: 
 *                  type: string
 *             example:
 *               title: fake title
 *               article: this is a fake article title
 *               image: example.png
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 * 
 *   patch:
 *     summary: Like or unlike article/post
 *     description: Logged in users can like their posts or other peoples post. 
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user who is performing the action.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   
 */

/**
 * @swagger
 * /users/invite/single:
 *   post:
 *     summary: Invite a single user
 *     description: Only admins can invite a user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - role
 *               - stack
 *               - gender
 *               - image
 *             properties:
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *              role:
 *                  type: string
 *                  enum: [user, admin, superadmin]
 *              stack:
 *                  type: string
 *              gender:
 *                  type: string
 *              image:
 *                  type: string
 *              example:
 *                firstName: fake name
 *                lastName: fake name
 *                email: john@doe.com
 *                role: user
 *                stack: student
 *                gender: 123456
 *                image: example.jpg
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Invite'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */


export default router;
