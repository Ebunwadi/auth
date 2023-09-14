import express from 'express'
import * as UserController from '../controllers/user.controller'
import validateSignUp from 'middlewares/validations/validate'

const router = express.Router()

router.post('/signup', validateSignUp, UserController.signUp)

router.post('/login', UserController.login)

export default router
