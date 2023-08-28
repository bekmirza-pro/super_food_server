import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
    _id: string
    name: string
    username: string
    phone_number: number
    type: string
}

const UserSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String
    },
    username:{
        type: String
    },
    phone_number: {
        type: Number,
        unique: true,
        required: true
    },
    type: {
        type: String,
        default: 'user'
    }
})

export default mongoose.model<IUser>('User', UserSchema)
