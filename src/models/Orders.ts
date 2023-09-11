
import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IOrder extends Document {
    _id: string
    user_id: string
    foods: string
    number: number
    commit:string
    status: boolean
    created_at: Date
}

const OrderSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    user_id: {
        type: String,
        ref: 'User'
    },
    food_id: {
        type: String,
        ref: 'Food'
    },
    number:{
        type:Number
    },
    commit:{
        type:String
    },
    status:{
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IOrder>('Order', OrderSchema)
