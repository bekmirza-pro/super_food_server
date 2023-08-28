import { FoodRepo, IFoodAllResponse } from '../repo/food'
import Food, { IFood } from '../../models/Food'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class FoodStorage implements FoodRepo {
    private scope = 'storage.food'

    async find(query: Object): Promise<IFood[]> {
        try {
            let foods = await Food.find({ ...query })
            
            return foods
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IFood> {
        try {
            let food = await Food.findOne({ ...query })
            // .populate(['creator', 'category'])
            if (!food) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'food_404')
            }

            return food
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IFood): Promise<IFood> {
        try {
            let food = await Food.create(payload)

            return food
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: IFood): Promise<IFood> {
        try {
            let food = await Food.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!food) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'food_404')
            }

            return food
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(id: string, payload: Object): Promise<Object> {
        try {
            let foods = await Food.updateMany({ creator: id }, payload)
            if (!foods) {
                logger.warn(`${this.scope}.update failed to updateMany`)
                throw new AppError(404, 'food_404')
            }
            return foods
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let food = await Food.findByIdAndDelete(id)

            if (!food) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'sample_404')
            }

            return food
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
