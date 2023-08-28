import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class UserValidator {
    keys = {
        required: 'required',
        optional: 'optional'
    }

    createSchema = Joi.object({
         name:Joi.string().required(),
         username:Joi.string().required(),
         phone_number: Joi.number().required(),
    })

    updateSchema = Joi.object({
         name:Joi.string().required(),
         username:Joi.string().required(),
         phone_number: Joi.number().required(),
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
