import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'

const signupSchema = Joi.object().keys({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirmPassword: Joi.ref('password')
})

export const validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
  await signupSchema.validateAsync(req.body)
  next()
}

const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().min(4).max(50).required(),
  confirmPassword: Joi.string().min(4).max(50).required()
})

export const validateResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  await resetPasswordSchema.validateAsync(req.body)
  next()
}

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required()
})

export const validateForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  await forgotPasswordSchema.validateAsync(req.body)
  next()
}
