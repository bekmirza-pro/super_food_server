import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IFood extends Document {
    _id: string
    name: string
    description: string
    number: number
    price: string
    images: string[]
    madeAt: number
}

const FoodSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    number:{
        type: Number
    },
    price: {
        type: String
    },
    images: [
        {
            type: String
        }
    ],
    madeAt: {
        type: Number,
        default: Date.now
    }
})

export default mongoose.model<IFood>('Food', FoodSchema)
