import { cleanEnv } from 'envalid'
import { port, str } from 'envalid/dist/validators'

export default cleanEnv(process.env, {
  DATABASE_URI: str(),
  PORT: port(),
  JWT_TOKEN_SECRET: str(),
  MAIL_PASSWORD: str(),
  MAIL_USER: str(),
  MAIL_SERVICE: str(),
  BASE_URL: str()
})
