import express from 'express';
import controller from '../controllers/record';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Records
 *     description: CRUD endpoints for records
 *
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *         relatedEntityType:
 *           type: string
 *           example: "user"
 *         relatedEntityId:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *         data:
 *           type: object
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /records:
 *   post:
 *     summary: Creates a record
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation failed (Joi)
 */
router.post('/', ValidateJoi(Schemas.record.create), controller.createRecord);

/**
 * @openapi
 * /records/{recordId}:
 *   get:
 *     summary: Gets a record by ID
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The record's ObjectId
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/:recordId', controller.readRecord);

/**
 * @openapi
 * /records:
 *   get:
 *     summary: Lists all records
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.readAll);

/**
 * @openapi
 * /records/{recordId}:
 *   delete:
 *     summary: Deletes a record by ID
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The record's ObjectId
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:recordId', controller.deleteRecord);

export default router;