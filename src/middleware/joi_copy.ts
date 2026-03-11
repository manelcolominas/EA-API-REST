import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IRestaurant } from '../models/restaurant';
import { ICustomer } from '../models/customer';
import { IBadgeCustomer } from '../models/badgeCustomer';
import { IBadgeRestaurant } from '../models/badgeRestaurant';
import { IReview } from '../models/review';
import { IReward } from '../models/reward';
import { IStatistics } from '../models/statistics';
import { IVisit } from '../models/visit';

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
        create: Joi.object<IRestaurant>({
            name: Joi.string().required()
        }),
        update: Joi.object<IRestaurant>({
            name: Joi.string().required()
        })
    },
    user: {
        create: Joi.object<ICustomer>({
            organization: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),
        update: Joi.object<ICustomer>({
            organization: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })
    }
};
