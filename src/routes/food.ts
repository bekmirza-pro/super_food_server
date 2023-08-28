import { Router } from 'express'
import { FoodController } from '../controllers/food'
import { FoodValidator } from '../validators/food'
import multer from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new FoodController()
const validator = new FoodValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 10).single('images')

router.route('/all').get(controller.getAll)
router
    .route('/create')
    .post(middleware.auth(['admin']), upload, validator.create, controller.create)
router.route('/filter/:id').get(controller.getAll)
router
    .route('/:id')
    .get(controller.get)
    .patch(middleware.auth(['admin']), upload, validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
