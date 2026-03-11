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
    restaurant: {
        create: Joi.object<IRestaurant>({
            profile: Joi.object({
                name: Joi.string().required(),
                description: Joi.string(),
                rating: Joi.number().min(0).max(10),
                category: Joi.array().items(Joi.string()),
                timetable: Joi.array().items(Joi.string()),
                image: Joi.array().items(Joi.string().uri()),

                contact: Joi.object({
                    phone: Joi.string(),
                    email: Joi.string().email()
                }),

                location: Joi.object({
                    city: Joi.string().required(),
                    address: Joi.string().required(),
                    coordinates: Joi.object({
                        type: Joi.string().valid('Point').default('Point'),
                        coordinates: Joi.array()
                            .items(Joi.number())
                            .length(2)
                            .required()
                    }).required()
                }).required()
            }).required(),

            rewards: Joi.array().items(
                Joi.string().length(24).hex()
            ),

            statistics: Joi.string().length(24).hex(),

            badges: Joi.array().items(
                Joi.string().length(24).hex()
            )
        }),
        update: Joi.object<IRestaurant>({
            profile: Joi.object({
                name: Joi.string(),
                description: Joi.string(),
                rating: Joi.number().min(0).max(5),

                category: Joi.array().items(Joi.string()),
                timetable: Joi.array().items(Joi.string()),
                image: Joi.array().items(Joi.string().uri()),

                contact: Joi.object({
                    phone: Joi.string(),
                    email: Joi.string().email()
                }),

                location: Joi.object({
                    city: Joi.string(),
                    address: Joi.string(),
                    coordinates: Joi.object({
                        type: Joi.string().valid('Point'),
                        coordinates: Joi.array().items(Joi.number()).length(2)
                    })
                })
            }),

            rewards: Joi.array().items(
                Joi.string().length(24).hex()
            ),

            statistics: Joi.string().length(24).hex(),

            badges: Joi.array().items(
                Joi.string().length(24).hex()
            )
        })
    }
};
