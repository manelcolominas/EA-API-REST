import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IOrganization } from '../models/organization';
import { IUser } from '../models/user';
import { IRecord } from '../models/record';
import Logging from '../library/logging';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    organization: {
        create: Joi.object<IOrganization>({
            name: Joi.string().required()
        }),
        update: Joi.object<IOrganization>({
            name: Joi.string().optional(),
            users: Joi.array().items(Joi.string()).optional()
        })
    },
    user: {
        create: Joi.object<IUser>({
            organization: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),
        update: Joi.object<IUser>({
            organization: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })
    },

    record: {
        create: Joi.object<IRecord>({
            relatedEntityType: Joi.string().required(),
            relatedEntityId: Joi.string().required(),
            changes: Joi.array().items(
                Joi.object({
                    field: Joi.string().required(),
                    previous: Joi.any().required(),
                    current: Joi.any().required()
                }).required())
        })
    }
};
