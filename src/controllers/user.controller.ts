import { RequestHandler } from 'express'
import { errMsg, successMsg } from '../utils/responseMsg'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import env from '../utils/validateEnv'
import sendEmail from '../utils/sendEmail'
import Service from '../models/Service'

export const signUp: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body

  const existingEmail = await User.findOne({ email: email }).exec()

  if (existingEmail) {
    return errMsg(409, 'error', 'email already exist', res)
  }

  const passwordHashed = await bcrypt.hash(password, 10)

  const user = await User.create({
    username,
    email,
    password: passwordHashed
  })

  const payload = {
    id: user._id
  }
  const accessToken = jwt.sign(payload, env.JWT_TOKEN_SECRET, { expiresIn: '15m' })

  successMsg(201, 'success', { accessToken }, res)
}

export const login: RequestHandler = async (req, res) => {
  const password = req.body.password
  const email = req.body.email

  const user = await User.findOne({ email: email }).exec()

  if (!user) {
    return errMsg(400, 'error', 'invalid username or password', res)
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return errMsg(400, 'error', 'invalid username or password', res)
  }

  const payload = {
    id: user._id
  }
  const accessToken = jwt.sign(payload, env.JWT_TOKEN_SECRET, { expiresIn: '15m' })

  successMsg(200, 'success', accessToken, res)
}

// forgot password functionality
export const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email: email }).exec()
  if (!user) {
    return res.status(401).json({
      status: 'error',
      error: 'Email doesnt exist'
    })
  }

  const payload = {
    id: user._id,
    name: user.username
  }
  const token = jwt.sign(payload, env.JWT_TOKEN_SECRET, { expiresIn: '10m' })
  const link = `${env.BASE_URL}/resetPassword/${payload.id}/${token}`

  sendEmail(
    email,
    'Password Reset',
    `hello ${payload.name}, you requested a change in your password you can reset it using this link ${link}.
      The link expires in ten mins`,
    res
  )
}

export const passwordReset: RequestHandler = async (req, res) => {
  const { id, token } = req.params
  const { password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 'error',
      error: 'passwords doesnt match'
    })
  }
  const verify: any = jwt.verify(token, env.JWT_TOKEN_SECRET)
  const userid = verify.id
  const user = await User.findById({ _id: id }).exec()

  if (!user) {
    return res.status(401).json({
      status: 'error',
      error: 'User does not exist'
    })
  }

  if (userid !== id) {
    return res.status(401).json({
      status: 'error',
      error: 'unauthorised user'
    })
  }
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)

  await User.findOneAndUpdate(
    { id },
    {
      password: hashedPassword
    },
    {
      new: true
    }
  )
  return res.status(201).json({
    status: 'success',
    data: {
      message: 'Password Successfully Updated'
    }
  })
}

// contactform
export const serviceForm: RequestHandler = async (req, res) => {
  const { name, email, budgetPrice, services, comment, recommend, experience, improvement } = req.body

  const service = await Service.create({
    name,
    email,
    budgetPrice,
    services,
    comment,
    recommend,
    experience,
    improvement
  })

  successMsg(201, 'success', service, res)
}
