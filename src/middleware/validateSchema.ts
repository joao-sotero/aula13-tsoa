import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

type RequestSegment = 'body' | 'params' | 'query';

export const validateSchema = (schema: ObjectSchema, segment: RequestSegment = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const requestData = (req as Record<RequestSegment, unknown>)[segment];
        const { error, value } = schema.validate(requestData, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const details = error.details.map(detail => detail.message);
            res.status(400).json({
                message: 'Validation failed',
                details
            });
            return;
        }

        (req as Record<RequestSegment, unknown>)[segment] = value;
        next();
    };
};
