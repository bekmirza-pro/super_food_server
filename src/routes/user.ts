import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidator } from '../validators/user'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const middleware = new Middleware()


router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router.route('/register').post( validator.create, controller.create)

router.route('/login').post( validator.create, controller.login)
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.get)
    .get(middleware.auth(['admin']), controller.getAll)
    .patch(middleware.auth(['admin']),  validator.update, controller.update)
    .delete(middleware.auth(['admin', 'user']), controller.delete)

export default router
