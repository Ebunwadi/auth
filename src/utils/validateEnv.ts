import { cleanEnv } from 'envalid'
import { port, str } from 'envalid/dist/validators'

export default cleanEnv(process.env, {
  DATABASE_URI: str(),
  PORT: port(),
  JWT_TOKEN_SECRET: str(),
  JWT_SECRET: str()
})
