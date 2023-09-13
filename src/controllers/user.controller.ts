import { RequestHandler } from 'express'
import { errMsg, successMsg } from '../utils/responseMsg'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import env from '../utils/validateEnv'

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
