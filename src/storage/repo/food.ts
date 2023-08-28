import { IFood } from '../../models/Food'

export interface IFoodAllResponse {
    payloads: IFood[]
    count: number
}

export interface FoodRepo {
    find(query: Object): Promise<IFood[]>
    findOne(query: Object): Promise<IFood>
    create(payload: IFood): Promise<IFood>
    update(id: string, payload: IFood): Promise<IFood>
    updateMany(id: string, payload: Object): Promise<Object>
    delete(id: string): Promise<IFood>
}
