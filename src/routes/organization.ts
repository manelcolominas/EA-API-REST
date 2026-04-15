import express from 'express';
import controller from '../controllers/organization';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Organizations
 *     description: CRUD endpoints for organizations
 *
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *         name:
 *           type: string
 *           example: "EA Company"
 *         users:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user ObjectIds
 *           example: ["65f1c2a1b2c3d4e5f6789012"]
 *     OrganizationCreateUpdate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "EA Company"
 */

/**
 * @openapi
 * /organizations:
 *   post:
 *     summary: Creates an organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizationCreateUpdate'
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation failed (Joi)
 */
router.post('/', ValidateJoi(Schemas.organization.create), controller.createOrganization);

/**
 * @openapi
 * /organizations/{id}/users:
 *   get:
 *     summary: Gets a single organization with populated users
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The organization's ObjectId
 *     responses:
 *       200:
 *         description: Returns the organization with populated users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.get('/:id/users', controller.getOrganizationWithUsers);

/**
 * @openapi
 * /organizations/{organizationId}:
 *   get:
 *     summary: Gets an organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The organization's ObjectId
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Not found
 */
router.get('/:organizationId', controller.readOrganization);

/**
 * @openapi
 * /organizations:
 *   get:
 *     summary: Lists all organizations
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
router.get('/', controller.readAll);

/**
 * @openapi
 * /organizations/{organizationId}:
 *   put:
 *     summary: Updates an organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The organization's ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizationCreateUpdate'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation failed (Joi)
 */
router.put('/:organizationId', ValidateJoi(Schemas.organization.update), controller.updateOrganization);

/**
 * @openapi
 * /organizations/{organizationId}:
 *   delete:
 *     summary: Deletes an organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The organization's ObjectId
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Not found
 */
router.delete('/:organizationId', controller.deleteOrganization);

/**
 * @openapi
 * /organizations/{organizationId}/users/{userId}:
 *   delete:
 *     summary: Removes a user from an organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The organization's ObjectId
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ObjectId
 *     responses:
 *       200:
 *         description: User removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.delete('/:organizationId/users/:userId', controller.removeUserFromOrganization);

export default router;
