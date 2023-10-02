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
import Food from '../models/Food'


export class FoodController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
       
        const foods = await storage.food.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                foods
            },
            message: message('food_getAll_200', lang)
        })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const food = await storage.food.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                food
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo

        if (req.file) {
            photo = `${req.file.fieldname}-${uuidv4()}`

            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads/images', `${photo}.png`))
        }
        const food = await storage.food.create({
            ...req.body,
            images: `${photo}.png`
        })

        res.status(201).json({
            success: true,
            data: {
                food
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        let food
 
        if (req.file) {
            
            const foods = await Food.findById(req.params.id)

            if (`${foods?.images}` !== 'undefined.png') {
                await unlink(path.join(__dirname, '../../uploads/images', `${foods?.images}`))
            }

            photo = `${req.file.fieldname}-${uuidv4()}`

            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads/images', `${photo}.png`))

            food = await storage.food.update(req.params.id, {
                ...req.body,
                images: `${photo}.png`
            })
        } else {
            food = await storage.food.update(req.params.id, req.body)
        }

        res.status(200).json({
            success: true,
            data: {
                food
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const food = await Food.findById(req.params.id)

        if (`${food?.images}` !== 'undefined') {
            await unlink(path.join(__dirname, '../../uploads/images', `${food?.images}`))
        }

        await storage.food.delete(req.params.id)
        res.status(200).json({
            success: true,
            data: null
        })
    })
}
