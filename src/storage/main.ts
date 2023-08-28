import { SampleStorage } from './mongo/sample'
import { AdminStorage } from './mongo/admin'
import { UserStorage } from './mongo/user'
import { OrderStorage } from './mongo/order'
import { FoodStorage } from './mongo/food'

interface IStorage {
    sample: SampleStorage
    admin: AdminStorage
    user: UserStorage
    order: OrderStorage
    food: FoodStorage
}

export let storage: IStorage = {
    sample: new SampleStorage(),
    admin: new AdminStorage(),
    user: new UserStorage(),
    order: new OrderStorage(),
    food: new FoodStorage()
}
