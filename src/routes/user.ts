import express from 'express'
import * as userController from '../controllers/user.controller'
import * as validate from '../middlewares/validations/validate'

const router = express.Router()

router.post('/signup', validate.validateSignUp, userController.signUp)

router.post('/login', userController.login)

router.post('/forgotPassword', validate.validateForgotPassword, userController.forgotPassword)

router.patch('/resetPassword/:id/:token', validate.validateResetPassword, userController.passwordReset)

export default router
