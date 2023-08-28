import Joi, { string } from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class FoodValidator {
    keys = {
        required: 'required',
        optional: 'optional'
    }

    createSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        number: Joi.number(),
        price: Joi.string(),
        images: Joi.string()
    })

    updateSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        number: Joi.number(),
        price: Joi.string().required(),
        images: Joi.string()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createSchema.validate(req.body)

        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
