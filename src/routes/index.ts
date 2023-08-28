import express, { Router } from 'express'
import path from 'path'
import sampleRouter from './sample'
import adminRouter from './admin'
import foodRouter from './food'
import orderRouter from './order'
import userRouter from './user'

const router = Router({ mergeParams: true })

router.use('/api/file', express.static(path.join(__dirname, '../../uploads/images')))
router.use('/sample', sampleRouter)
router.use('/admin', adminRouter)
router.use('/user', userRouter)
router.use('/food', foodRouter)
router.use('/order', orderRouter)

export default router
