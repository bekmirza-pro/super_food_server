import { NextFunction, Request, Response } from 'express'
import { logger } from '../config/logger'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import sharp from 'sharp'
import { unlink } from 'fs/promises'
import { message } from '../locales/get_message'
import { signToken } from '../middleware/auth'
import User from '../models/User'
import Order from '../models/Orders'

export class UserController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const users = await storage.user.find(req.body)

        res.status(200).json({
            success: true,
            data: {
                users
            },
            message: message('user_getAll_200', lang)
        })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
        const user = await storage.user.create({ ...req.body })

        const token = await signToken(user.id, user.type)
        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne({ phone_number: req.body.phone_number })

        if (!user) {
            return next(new AppError(404, 'User not found !!!'))
        }

        const token = await signToken(user.id, user.type)

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        let user

            user = await storage.user.update(req.params.id, req.body)
        

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById(req.params.id)

        if (user) {
            const findOrder = await Order.find({user_id:user.id})

            if (findOrder) {
                findOrder.map(async (findorder)=>{
                    console.log(findorder);
                    await storage.order.delete(findorder.id)
                })
            }
        }    

        await storage.user.delete(req.params.id)
        
        res.status(200).json({
            success: true,
            data: null
        })
    })
}
