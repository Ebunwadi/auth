import { InferSchemaType, model, Schema } from 'mongoose'

const serviceSchema = new Schema({
  name: { type: String },
  email: { type: String },
  budgetPrice: { type: Number },
  services: { type: String },
  recommend: { type: String },
  experience: { type: String },
  improvement: { type: [String] },
  comment: { type: String }
})

type Service = InferSchemaType<typeof serviceSchema>

export default model<Service>('Service', serviceSchema)
